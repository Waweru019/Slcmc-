import { Component, OnInit, signal, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { ApiService, UserProfileResponse } from '@core/services/api';
import { 
  faEnvelope, faBell, faBars, faEllipsisV, faMessage, faEdit, faInbox, faPaperPlane, 
  faFileAlt, faStar, faTrash, faUndo, faRedo, faClock, faTrashAlt, faChevronLeft, 
  faChevronRight, faChevronDown, faReply, faForward, faXmark 
} from '@fortawesome/free-solid-svg-icons';

import { Privacsettings } from './privacsettings/privacsettings';
import { Personaldetails } from './personaldetails/personaldetails';
import { Message } from './message/message';
import { Profile } from './profile/profile';
import { Dashboard } from './dashboard/dasboard';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    CommonModule, 
    Personaldetails, 
    Message, 
    Dashboard, 
    Privacsettings, 
    Profile
  ], 
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Core UI Control States
  isSidebarOpen = false;
  isMenuOpen = false;
  activePage: 'dashboard' | 'personal' | 'message' | 'announcements' | 'profile' | 'events' | 'privacy' = 'dashboard';
  
  // User Identity Context Object
  user: any = null;
  currentUserId!: number;

  // Modern UI Signals management
  notificationCount = signal<number>(0);
  showNotificationDropdown = signal<boolean>(false);
  notificationsList = signal<any[]>([]);
  totalUnreadCount = signal<number>(0); 
  announcementsList = signal<any[]>([]);
  announcementCount = signal<number>(0);
  userProfile = signal<UserProfileResponse | null>(null);

  // FontAwesome Icon Mapping Declarations
  faEnvelope = faEnvelope; faBell = faBell; faBars = faBars; faDots = faEllipsisV;
  faMessage = faMessage; faEdit = faEdit; faInbox = faInbox; faPaperPlane = faPaperPlane;
  faFileAlt = faFileAlt; faStar = faStar; faTrash = faTrash; faUndo = faUndo;
  faRedo = faRedo; faClock = faClock; faTrashAlt = faTrashAlt; faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight; faChevronDown = faChevronDown; faReply = faReply;
  faForward = faForward; faXmark = faXmark;

  ngOnInit() {
    // 1. Safely extract session state objects
    const storedUser = sessionStorage.getItem('user');
    const rawUserId = sessionStorage.getItem('user_id') || localStorage.getItem('userId');
    
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.currentUserId = this.user.id;
      } catch (e) {
        console.error("Failed to parse 'user' session JSON payload:", e);
      }
    } else if (rawUserId) {
      this.currentUserId = Number(rawUserId);
    }

    if (this.userStatus === 'pending') {
      this.activePage = 'personal';
    }

    if (this.currentUserId) {
      this.fetchTotalUnread();
      setInterval(() => this.fetchTotalUnread(), 30000);
    }

    // 2. Fallback Verification Lookup
    const activeUserId = 
      this.currentUserId || 
      this.user?.id || 
      this.user?.user_id || 
      sessionStorage.getItem('user_id') || 
      localStorage.getItem('userId');

    console.log("Portal initialization verification check -> Resolved ID:", activeUserId);

    if (activeUserId) {
      this.getUserProfile(Number(activeUserId));
    } else {
      console.error("🚨 CRITICAL: Component could not find a valid user identity ID in browser memory caches!");
    }
    
    // 3. Load Metrics
    this.checkNotificationsCount();
    this.fetchAnnouncements();
    this.fetchAnnouncementCount();
  }

  get userStatus(): string {
    return (localStorage.getItem('status') || 'pending').toLowerCase().trim();
  }

  fetchTotalUnread() {
    this.apiService.getTotalUnreadCount(this.currentUserId).subscribe({
      next: (res) => {
        if (res && res.status === 'success') {
          this.totalUnreadCount.set(res.total_unread);
        }
      },
      error: (err) => console.error("Could not load total notification count:", err)
    });
  }

  getUserProfile(userId: number) {
    this.apiService.getPortalProfile(userId).subscribe({
      next: (data) => {
        console.log("Dashboard profile data loaded:", data);
        this.userProfile.set(data);
      },
      error: (err) => console.error("Failed to load dashboard statistics:", err)
    });
  }
  
  startDirectChatWithAlumni(targetAlumni: any): void {
    if (!targetAlumni) return;

    const conversationContext = {
      id: targetAlumni.id,
      First_name: targetAlumni.First_name,
      last_name: targetAlumni.last_name || '',
      photo: targetAlumni.photo || ''
    };

    sessionStorage.setItem('pending_chat_recipient', JSON.stringify(conversationContext));
    this.setActivePage('message');
  }

  fetchAnnouncements(): void {
    this.apiService.getAnnouncements().subscribe({
      next: (res) => {
        if (res && res.status === 'success' && Array.isArray(res.data)) {
          this.announcementsList.set(res.data);
        } else {
          console.warn('Backend returned an unhandled response layout:', res);
        }
      },
      error: (err) => console.error('Failed to retrieve announcements payload:', err)
    });
  }

  fetchAnnouncementCount(): void {
    this.apiService.getAnnouncementCount().subscribe({
      next: (res) => {
        if (res && res.status === 'success' && res.count !== undefined) {
          this.announcementCount.set(Number(res.count));
        } else {
          console.warn('Backend metric response structure mismatched:', res);
        }
      },
      error: (err) => console.error('Failed to update dashboard metric badge counters:', err)
    });
  }

  checkNotificationsCount(): void {
    const activeUserId = this.user?.id || sessionStorage.getItem('user_id');
    if (!activeUserId) return;

    this.apiService.getAnnouncementCount().subscribe({
      next: (res) => {
        if (res && res.status === 'success' && res.count !== undefined) {
          this.notificationCount.set(Number(res.count));
        }
      },
      error: (err) => console.error('Error fetching notification badge counts:', err)
    });
  }

  toggleNotificationDropdown(): void {
    this.showNotificationDropdown.update(val => !val);
    
    if (this.showNotificationDropdown()) {
      this.apiService.getAnnouncements().subscribe({
        next: (res) => {
          if (res && res.status === 'success' && Array.isArray(res.data)) {
            this.notificationsList.set(res.data);
            this.notificationCount.set(0); 
          }
        },
        error: (err) => console.error('Error fetching dropdown list updates:', err)
      });
    }
  }

  setActivePage(page: 'dashboard' | 'personal' | 'message' | 'announcements' | 'profile' | 'events' | 'privacy'): void {
    this.activePage = page;
    this.isSidebarOpen = false; 
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void { this.isSidebarOpen = false; }

  logout(): void {
    this.apiService.logoutServer().subscribe({
      next: () => this.clearLocalSessionAndRedirect(),
      error: (err) => {
        console.error('Logout failed on server, clearing all local caches anyway:', err);
        this.clearLocalSessionAndRedirect();
      }
    });
  }

  private clearLocalSessionAndRedirect(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('first_name');
    this.router.navigate(['/login']);
  }
}