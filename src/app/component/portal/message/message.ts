import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '@core/services/api';
import { 
  faPaperPlane, 
  faUserCircle, 
  faXmark, 
  faTrash,
  faImage, 
  faFileLines,
  faPaperclip,
  faReply,
  faCheck,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import { SafeUrlPipe } from '../../../safe-url-pipe';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, SafeUrlPipe],
  templateUrl: './message.html'
})
export class Message implements OnInit, OnDestroy {
  private apiService = inject(ApiService);

  currentUserId!: number;
  
  // FontAwesome Icons mapping
  faPaperPlane = faPaperPlane;
  faUserCircle = faUserCircle;
  faTrash = faTrash;
  faXmark = faXmark;
  faImage = faImage;
  faFileLines = faFileLines;
  faPaperclip = faPaperclip;
  faReply = faReply;
  faCheck = faCheck;
  faCheckDouble = faCheckDouble;

  // Modern Reactive Signals Array Layouts
  alumniDirectory = signal<any[]>([]);
  activeRecipient = signal<any | null>(null);
  chatMessages = signal<any[]>([]);
  
  typedText = signal<string>('');
  isFileMenuOpen = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  isSendingMessage = signal<boolean>(false);

  // Template State Tracking Signals
  isLoadingDirectory = signal<boolean>(false);
  isLoadingChat = signal<boolean>(false);

  // Responsive Layout Management
  isMobileDirectoryOpen = signal<boolean>(true); 

  // Media Modal Signal States
  previewImageUrl = signal<string | null>(null);
  previewDocUrl = signal<string | null>(null); 

  // Message Actions States
  selectedMessageIds = signal<number[]>([]);
  isSelectionMode = signal<boolean>(false);
  replyingToMessage = signal<any | null>(null);

  // Swipe Mechanics Runtime Properties
  activeSwipeMessageId = signal<number | null>(null);
  currentSwipeOffset = signal<number>(0);
  private startX: number = 0;

  // Background Processing Tracker
  private pollingInterval: any;

  isOnline(lastSeenString: string): boolean {
    if (!lastSeenString) return false;
    const lastSeen = new Date(lastSeenString);
    const now = new Date();
    return (now.getTime() - lastSeen.getTime()) < 120000;
  }

  ngOnInit() {
    const storedUser = sessionStorage.getItem('user');
    const rawUserId = sessionStorage.getItem('user_id') || localStorage.getItem('userId');
    
    if (storedUser) {
      this.currentUserId = JSON.parse(storedUser).id;
    } else if (rawUserId) {
      this.currentUserId = Number(rawUserId);
    }

    if (!this.currentUserId) {
      console.error("🚨 Messaging view cannot find your logged-in user ID!");
      return;
    }

    this.loadDirectory();
    
    const pendingChatRecipient = sessionStorage.getItem('pending_chat_recipient');
    if (pendingChatRecipient) {
      try {
        const targetedPeer = JSON.parse(pendingChatRecipient);
        this.activeRecipient.set(targetedPeer);
        this.isMobileDirectoryOpen.set(false); 
        this.loadChatHistory();
        sessionStorage.removeItem('pending_chat_recipient');
      } catch (e) {
        console.error("Failed to parse navigation chat token keys:", e);
      }
    }
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  triggerFileInput(inputId: string): void {
    const element = document.getElementById(inputId) as HTMLInputElement;
    if (element) {
      element.click();
    } else {
      console.warn(`File input element with id '${inputId}' was not found.`);
    }
  }

  loadDirectory() {
    this.isLoadingDirectory.set(true);
    this.apiService.getAlumniDirectory(this.currentUserId).subscribe({
      next: (res) => {
        if (res && res.status === 'success') {
          this.alumniDirectory.set(res.data);
        }
        this.isLoadingDirectory.set(false);
      },
      error: (err) => {
        console.error("XHR HTTP failure loading directory:", err);
        this.isLoadingDirectory.set(false);
      }
    });
  }

  selectAlumni(alumni: any) {
    alumni.unread_count = 0; 
    this.activeRecipient.set(alumni);
    this.isMobileDirectoryOpen.set(false); 
    this.chatMessages.set([]); 
    this.loadChatHistory();
  }

  loadChatHistory() {
    const recipient = this.activeRecipient();
    if (!recipient) return;

    const cacheKey = `chat_cache_${this.currentUserId}_with_${recipient.id}`;
    const cachedData = localStorage.getItem(cacheKey);
    let localMessages: any[] = [];
    let lastTimestamp = '';

    if (cachedData) {
      localMessages = JSON.parse(cachedData);
      if (this.chatMessages().length === 0) {
        this.chatMessages.set(localMessages); 
      }
      if (localMessages.length > 0) {
        lastTimestamp = localMessages[localMessages.length - 1].created_at;
      }
    }

    this.isLoadingChat.set(this.chatMessages().length === 0);
    this.apiService.getChatHistory(this.currentUserId, recipient.id, lastTimestamp).subscribe({
      next: (res) => {
        if (res && res.status === 'success') {
          const newMessages = res.data;
          if (newMessages.length > 0) {
            const combinedMessages = [...localMessages, ...newMessages];
            localStorage.setItem(cacheKey, JSON.stringify(combinedMessages));
            this.chatMessages.set(combinedMessages);
          }
          this.triggerMarkAsRead(recipient.id);
        }
        this.isLoadingChat.set(false);
      },
      error: (err) => {
        console.error("XHR Sync failure:", err);
        this.isLoadingChat.set(false);
      }
    });
  }

  triggerMarkAsRead(senderId: number) {
    const payload = { user_id: this.currentUserId, sender_id: senderId };
    this.apiService.markAsRead(payload).subscribe({
      next: (res) => {
        const currentMessages = this.chatMessages();
        const updatedMessages = currentMessages.map(msg => {
          if (msg.sender_id === senderId) {
            return { ...msg, is_read: 1 };
          }
          return msg;
        });

        this.chatMessages.set(updatedMessages);
        const cacheKey = `chat_cache_${this.currentUserId}_with_${senderId}`;
        localStorage.setItem(cacheKey, JSON.stringify(updatedMessages));
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file); 
    }
  }

  transmitMessage() {
    const recipient = this.activeRecipient();
    if (!recipient) return;
    
    const textValue = this.typedText().trim();
    const fileValue = this.selectedFile();
    if (!textValue && !fileValue) return;

    this.isSendingMessage.set(true);

    const formData = new FormData();
    formData.append('sender_id', this.currentUserId.toString());
    formData.append('receiver_id', recipient.id.toString());
    formData.append('message_text', textValue);
    
    if (fileValue) {
      formData.append('attachment', fileValue, fileValue.name);
    }

    const replyContext = this.replyingToMessage();
    if (replyContext) {
      formData.append('parent_id', replyContext.id.toString());
    }

    this.apiService.sendMessage(formData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.typedText.set(''); 
          this.selectedFile.set(null); 
          this.replyingToMessage.set(null);
          
          const fileInput = document.getElementById('fileAttachmentInput') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          
          this.loadChatHistory();
          this.loadDirectory();
        }
        this.isSendingMessage.set(false);
      },
      error: (err) => {
        console.error("Attachment upload failure:", err);
        this.isSendingMessage.set(false);
      }
    });
  }

  // Swipe Action Hooks (Ontouch Handlers)
  onTouchStart(event: TouchEvent, msgId: number) {
    this.startX = event.touches[0].clientX;
    this.activeSwipeMessageId.set(msgId);
  }

  onTouchMove(event: TouchEvent, msgId: number) {
    if (this.activeSwipeMessageId() !== msgId) return;
    const currentX = event.touches[0].clientX;
    const offset = currentX - this.startX;

    if (offset >= 0 && offset <= 80) {
      this.currentSwipeOffset.set(offset);
    }
  }

  onTouchEnd(event: TouchEvent, msg: any) {
    if (this.activeSwipeMessageId() === msg.id && this.currentSwipeOffset() > 45) {
      this.replyingToMessage.set(msg);
    }
    this.activeSwipeMessageId.set(null);
    this.currentSwipeOffset.set(0);
  }

  toggleMessageSelection(msgId: number) {
    const current = this.selectedMessageIds();
    if (current.includes(msgId)) {
      this.selectedMessageIds.set(current.filter(id => id !== msgId));
    } else {
      this.selectedMessageIds.set([...current, msgId]);
    }
  }

  cancelSelection() {
    this.selectedMessageIds.set([]);
  }

  deleteSelectedMessages() {
    const idsToDelete = this.selectedMessageIds();
    if (idsToDelete.length === 0) return;

    if (confirm(`Are you sure you want to delete these ${idsToDelete.length} message(s)?`)) {
      const payload = { user_id: this.currentUserId, message_ids: idsToDelete };
      this.apiService.deleteMessages(payload).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            const updated = this.chatMessages().filter(msg => !idsToDelete.includes(msg.id));
            this.chatMessages.set(updated);
            this.cancelSelection();
            
            const cacheKey = `chat_cache_${this.currentUserId}_with_${this.activeRecipient().id}`;
            localStorage.setItem(cacheKey, JSON.stringify(updated));
            this.loadDirectory();
          }
        }
      });
    }
  }

  clearEntireChat() {
    const recipient = this.activeRecipient();
    if (!recipient) return;

    if (confirm("🚨 WARNING: Are you absolutely sure you want to delete ALL messages in this chat?")) {
      const payload = { user_id: this.currentUserId, recipient_id: recipient.id };
      this.apiService.clearChat(payload).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.chatMessages.set([]);
            this.cancelSelection();
            const cacheKey = `chat_cache_${this.currentUserId}_with_${recipient.id}`;
            localStorage.removeItem(cacheKey);
            this.loadDirectory();
          }
        }
      });
    }
  }

  openImageModal(filePath: string): void { this.previewImageUrl.set(filePath); }
  closeImageModal(): void { this.previewImageUrl.set(null); }
  openDocModal(filePath: string): void { this.previewDocUrl.set(filePath); }
  closeDocModal(): void { this.previewDocUrl.set(null); }
  openDirectoryOnMobile(): void { this.isMobileDirectoryOpen.set(true); }
}
