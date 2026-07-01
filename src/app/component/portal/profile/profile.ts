import { Component, OnInit, signal, computed, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api';

export interface Alumni {
  id: number;
  First_name: string;
  photo?: string;
  Email?: string;
  Phone_number?: string;
  Employer?: string;
  Role?: string;
  Programme?: string;
  MembershipOrg?: string;
  MembershipID?: string;
  LinkedIn?: string;
  Address?: string;
  home_county?: string;
  YearJoined?: number;
  GraduationYear?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  private apiService = inject(ApiService);
  
  @Output() onStartChat = new EventEmitter<Alumni>();

  // 🚦 State Signals
  alumniList = signal<Alumni[]>([]); 
  errorMessage = signal<string>('');
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false); 

  // 📄 Pagination Signals
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = 8; 
  loggedInUserId: number = 0;

  // ⚡ Computed Search Filter
  filteredAlumniList = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allAlumni = this.alumniList();

    if (!query) {
      return allAlumni;
    }

    return allAlumni.filter(alumni => 
      alumni.First_name && alumni.First_name.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loggedInUserId = Number(localStorage.getItem('userId') || sessionStorage.getItem('user_id'));
    this.fetchAlumniPage();
  }

  // Isolation fetch helper
  fetchAlumniPage(): void {
    this.isLoading.set(true);      
    this.errorMessage.set('');      

    this.apiService.getAlumniDirectoryPaginated(this.loggedInUserId, this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.alumniList.set(res.data);
          if (res.meta) {
            this.totalPages.set(res.meta.totalPages);
          }
        } else {
          this.errorMessage.set('No alumni segments found.');
          this.alumniList.set([]);
        }
        this.isLoading.set(false);   
      },
      error: (err) => {
        console.error('Failed to load roster records:', err);
        this.errorMessage.set('Could not establish synchronization stream.');
        this.isLoading.set(false);   
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && !this.isLoading()) {
      this.currentPage.set(page);
      this.fetchAlumniPage();
    }
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.set(inputElement.value);
  }

  triggerDirectMessage(alumni: Alumni): void {
    this.onStartChat.emit(alumni);
  }
}