import { Component } from '@angular/core';
import { Dashboard } from './dashboard/dashboard';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Ensure this is imported
import { 
  faEnvelope, faBell, faBars, faEllipsisV, faMessage, faEdit, faInbox, faPaperPlane, faFileAlt, faStar, faTrash,
  faUndo, faRedo, faClock, faTrashAlt, faChevronLeft, faChevronRight, 
  faChevronDown, faReply, faForward, faXmark,
  faChartPie, faGraduationCap, faSignOutAlt // Added contextual nav & logout icons
} from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Programs } from './programs/programs';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [Dashboard, CommonModule, Programs, HttpClientModule, FontAwesomeModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  isSidebarOpen: boolean = false;
  
  // Icon Assignments
  faBars = faBars;
  faXmark = faXmark;
  faChartPie = faChartPie;
  faGraduationCap = faGraduationCap;
  faSignOutAlt = faSignOutAlt;
  faBell = faBell;
  faEnvelope = faEnvelope;
  
  faMessage = faMessage;
  faEdit = faEdit;
  faInbox = faInbox;
  faPaperPlane = faPaperPlane;
  faFileAlt = faFileAlt;
  faStar = faStar;
  faTrash = faTrash;
  faUndo = faUndo;
  faRedo = faRedo;
  faClock = faClock;
  faTrashAlt = faTrashAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faReply = faReply;
  faForward = faForward;
  faEllipsisV = faEllipsisV;
  
  showComposeModal = false;
  isMenuOpen: boolean = false;
  activePage: 'dashboard' | 'programs' = 'dashboard';
  user: any;
  private apiUrl = 'http://localhost/slcmc/admin.php';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
  
  setActivePage(page: 'dashboard' | 'programs'): void {
    this.activePage = page;
    this.isSidebarOpen = false; 
  }
  
  logout(): void {
    this.http.post<any>(`${this.apiUrl}?action=logout`, {}).subscribe({
      next: () => { this.clearLocalSessionAndRedirect(); },
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