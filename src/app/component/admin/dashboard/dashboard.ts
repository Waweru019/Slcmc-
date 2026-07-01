import { Component, OnInit, AfterViewInit, signal, effect, computed, ViewChild, ElementRef, Inject, PLATFORM_ID, Injector, runInInjectionContext, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import { ApiService } from '@core/services/api';

Chart.register(...registerables);

// CONTRACT TYPE SCHEMAS & INTERFACES
export interface User {
  id: number;
  First_name: string;
  Email: string;
  Phone_number: string;
  Graduation_class: string;
  photo?: string;
  Dob: string;
  Gender: string;
  status?: string;
  showDropdown?: boolean;
}

export interface AcademicRecord {
  user_id?: number | string;
  programme_name: string;
  cohort_name: string;
  graduation_year: string;
  reg_number?: string;
}

export interface SocialContact {
  user_id?: number | string;
  linkedin?: string;
  physical_address?: string;
  home_county?: string;
}

export interface CurrentEmployment {
  id?: number | string;
  user_id?: number | string;
  employer_name: string;
  role: string;
  employment_type: string;
  work_county: string;
  start_date: string;
}

export interface FurtherEducation {
  user_id?: number | string;
  institution: string;
  field_of_study: string;
  year_completed: string;
}

export interface ProffesionalMembership {
  user_id?: number | string;
  organization: string;
  membership_id: string;
}

export interface EmployementHistory {
  user_id?: number | string;
  employer_name: string;
  role: string;
  from_date: number;
  to_date: number;
}

export interface DashboardStats {
  totalUsers: number;
  users: User[];
  CurrentEmployment: CurrentEmployment[];
  EmployementHistory: EmployementHistory[];
  academicRecords: AcademicRecord[];
  FurtherEducation: FurtherEducation[];
  socialContact: any;
  ProffesionalMembership: ProffesionalMembership[];
  verifiedUsers: number;
  pendingUsers: number;
  revokedUsers: number;
  activeEmployees: number;
  cohort_count?: number;
  cohorts_count: number;
  programmes_count: number;
  cohortDistribution: { cohort_name: string; cnt: string | number }[];
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Dashboard implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  // DOM Canvas Template Accessors
  @ViewChild('cohortChartCanvas') cohortChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart', { static: false }) statusChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('countyChart', { static: false }) countyChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('employmentPieCanvas', { static: false }) employmentPieCanvas!: ElementRef<HTMLCanvasElement>;

  // Chart.js Lifecycle Metric Instances
  private cohortChartInstance: Chart | null = null;
  private statusChartInstance: Chart | null = null;
  private countyChartInstance: Chart | null = null;
  private employmentPieInstance: Chart | null = null;
 activeDropdownId: number | null = null;
  // State Signal Management Containers
  stats = signal<DashboardStats>({
    verifiedUsers: 0,
    cohorts_count: 0,
    programmes_count: 0,
    pendingUsers: 0,
    revokedUsers: 0,
    activeEmployees: 0,
    totalUsers: 0,
    users: [],
    CurrentEmployment: [],
    academicRecords: [],
    FurtherEducation: [],
    ProffesionalMembership: [],
    EmployementHistory: [],
    socialContact: {},
    cohortDistribution: []
  });

userRole: string = 'admin';
  // Bound Form Model Projections
  newUserForm = {
    First_name: '',
    email: '',
    role: 'admin',
    password: ''
  };

  newAnnouncement = {
    title: '',
    content: ''
  };


  // UI Layout Interactivity Signals
  showModal = signal(false);
  showAnnouncementModal = signal(false);
  showUserModal = signal(false);
  activeTab = 'personal';
  searchTerm = signal('');
  announcements = signal<Announcement[]>([]);
  statusFilter = signal('all');
  currentPage = signal(1);
  pageSize = signal(5);
  isEditMode = signal<boolean>(false);
  isSubmittingModal = signal<boolean>(false);
  // Selected Profiling Signal References
  selectedUser = signal<User | null>(null);
  selectedAcademicRecord = signal<any | null>(null);
  selectedCurrentEmployment = signal<any | null>(null);
  selectedFurtherEducation = signal<any | null>(null);
  selectedSocialContact = signal<any | null>(null);
  selectedEmployementHistory = signal<any | null>(null);
  selectedProffesionalMemebership = signal<any | null>(null);
  auditLogs = signal<any[]>([]);

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      if (user) console.log('Inspecting profile record changes for:', user.First_name);
    });
  }

  ngOnInit(): void {
  // 1. Get the item using the exact key 'role' from login, and make it lowercase
  const savedRole = localStorage.getItem('role') || 'admin';
  this.userRole = savedRole.toLowerCase().trim(); // This turns "Guest" into "guest"
  
  // 2. Add a temporary console log to verify exactly what role Angular sees:
  console.log('Current Dashboard User Role Evaluated As:', this.userRole);

  this.loadDashboardStats();
  this.loadAnnouncements();
  this.loadAuditLogs();
}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      runInInjectionContext(this.injector, () => {
        effect(() => {
          const data = this.stats();
          if (this.statusChartCanvas && this.countyChartCanvas && this.cohortChartCanvas) {
            this.renderStatusChart(data);
            this.renderCountyChart(data);
            this.renderCohortChart(data.cohortDistribution); 
          }
          if (this.employmentPieCanvas) {
            this.renderEmploymentPieChart(data);
          }
        });
      });
    }
  }

  // DYNAMIC STATE COMPUTED SIGNALS
  filteredUsers = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const filter = this.statusFilter().toLowerCase().trim();
    const allUsers = this.stats().users || [];
    const employments = this.stats().CurrentEmployment || [];

    return allUsers.filter(user => {
      const firstName = (user.First_name || '').toLowerCase();
      const email = (user.Email || '').toLowerCase();
      const matchesSearch = firstName.includes(search) || email.includes(search);
      const userStatus = (user.status || '').toLowerCase();
      
      let matchesFilter = false;
      if (filter === 'all') {
        matchesFilter = true;
      } else if (filter === 'verified') {
        matchesFilter = userStatus === 'verified';
      } else if (filter === 'pending' || filter === 'pending review') {
        matchesFilter = userStatus === 'pending' || userStatus === '';
      } else if (filter === 'employed') {
        matchesFilter = employments.some((emp: any) => emp.user_id == user.id);
      } else if (filter === 'unemployed') {
        matchesFilter = !employments.some((emp: any) => emp.user_id == user.id);
      } else if (filter === 'revoked') {
        matchesFilter = userStatus === 'revoked';
      }
      return matchesSearch && matchesFilter;
    });
  });

  totalPages = computed(() => {
    const total = this.filteredUsers().length;
    return Math.ceil(total / this.pageSize()) || 1;
  });

  paginatedUsers = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredUsers().slice(startIndex, endIndex);
  });

  employmentRate = computed(() => {
    const data = this.stats();
    const totalVerified = data.verifiedUsers || 0;
    const activeEmployees = data.activeEmployees || 0;
    if (totalVerified === 0) return 0;
    return Math.round((activeEmployees / totalVerified) * 1000) / 10;
  });

  // HTTP REST API ENDPOINT SERVICE HANDLERS
  loadDashboardStats(): void {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        console.log("Full statistics dynamic payload parsed successfully:", data);
        this.stats.set(data);
      },
      error: (err) => console.error('Error loading analytics records:', err)
    });
  }

  loadAnnouncements(): void {
    this.apiService.getAnnouncements().subscribe({
      next: (data) => this.announcements.set(data),
      error: (err) => console.error('Error loading announcement board:', err)
    });
  }

loadAuditLogs(): void {
  // 🔒 FRONTEND BLOCK FOR GUEST ROLE
  if (this.userRole === 'guest') {
    this.auditLogs.set([]); // Ensure it's clear
    return;
  }

  this.apiService.getAuditLogs().subscribe({
    next: (data) => {
      if (Array.isArray(data)) {
        this.auditLogs.set(data);
      }
    },
    error: (err) => console.error('Failed to load audit trail records:', err)
  });
}


// Full unified scratchpad matching all 7 tabs
modalUserData = {
  // 1. Personal
  id: 0,
  First_name: '',
  Email: '',
  Phone_number: '',
  Gender: '',
  Graduation_class: '',
  
  // 2. Academic
  programme_name: '',
  cohort_name: '',
  graduation_year: '',
  reg_number: '',
  
  // 3. Current Employment
  employer_name: '',
  role: '',
  employment_type: '',
  work_county: '',
  start_date: '',
  
  // 4. Further Education
  institution: '',
  field_of_study: '',
  year_completed: '',
  
  // 5. Professional Membership
  organization: '',
  membership_id: '',
  
  // 6. Social & Contact
  linkedin: '',
  physical_address: '',
  home_county: ''
};

openEditModal(user: any, event: Event): void {
  event.stopPropagation();
  
  if (this.userRole === 'guest') {
    alert('Access Denied.');
    return;
  }

  // 1. Turn on Edit Mode FIRST
  this.isEditMode.set(true);
  
  // Extract all relational records safely from your existing row signals/helpers
  const academic = this.selectedAcademicRecord() || {};
  const employment = this.selectedCurrentEmployment() || {};
  const education = this.selectedFurtherEducation() || {};
  const membership = this.selectedProffesionalMemebership() || {};
  const social = this.selectedSocialContact() || {};

  // Clone EVERYTHING into the scratchpad for editing
  this.modalUserData = {
    id: user.id,
    First_name: user.First_name || '',
    Email: user.Email || '',
    Phone_number: user.Phone_number || '',
    Gender: user.Gender || 'Male',
    Graduation_class: user.Graduation_class || '',
    
    programme_name: academic.programme_name || '',
    cohort_name: academic.cohort_name || '',
    graduation_year: academic.graduation_year || '',
    reg_number: academic.reg_number || '',
    
    employer_name: employment.employer_name || '',
    role: employment.role || '',
    employment_type: employment.employment_type || '',
    work_county: employment.work_county || '',
    start_date: employment.start_date || '',
    
    institution: education.institution || '',
    field_of_study: education.field_of_study || '',
    year_completed: education.year_completed || '',
    
    organization: membership.organization || '',
    membership_id: membership.membership_id || '',
    
    linkedin: social.linkedin || '',
    physical_address: social.physical_address || '',
    home_county: social.home_county || ''
  };

  this.selectedUser.set(user);
  this.showModal.set(true);
}
// Add this method inside your Dashboard component class (src/app/modules/dashboard/dashboard.ts)
saveProfileChanges(): void {
  if (!this.modalUserData.First_name.trim() || !this.modalUserData.Email.trim()) {
    alert('First Name and Email are required.');
    return;
  }

  const activeAdminId = localStorage.getItem('userId');
  if (!activeAdminId) {
    alert('Your session has expired. Please log in again.');
    return;
  }

  this.isSubmittingModal.set(true);

  const payload = {
    user_id: this.modalUserData.id,
    admin_id: parseInt(activeAdminId, 10),
    First_name: this.modalUserData.First_name,
    email: this.modalUserData.Email,
    Phone_number: this.modalUserData.Phone_number,
    Gender: this.modalUserData.Gender,
    Graduation_class: this.modalUserData.Graduation_class
  };

  this.apiService.editUser(payload).subscribe({
    next: (res: any) => {
      if (res.status === 'success') {
        alert(res.message);
        this.showUserModal.set(false); // Close modal panel
        this.loadDashboardStats();    // Refresh live table grid UI data rows
      } else {
        alert("Update rejected: " + res.message);
      }
      this.isSubmittingModal.set(false);
    },
    error: (err) => {
      console.error(err);
      alert("Failed to communicate profile changes to server.");
      this.isSubmittingModal.set(false);
    }
  });
}
toggleDropdown(targetUser: any, event: Event): void {
  event.stopPropagation(); // Prevents instant closing triggers
  
  // Close all other dropdown menus to keep layout clean
  const currentUsers = this.stats().users || [];
  currentUsers.forEach(u => {
    if (u.id !== targetUser.id) {
      u.showDropdown = false;
    }
  });

  // Toggle state for target user row context
  targetUser.showDropdown = !targetUser.showDropdown;
}
openViewModal(user: any, event: Event): void {
  event.stopPropagation();
  this.isEditMode.set(false); // Plain text reading mode
  this.modalUserData = { ...user };
  this.showUserModal.set(true);
}
// Complete removal method call connection logic
executeAccountDeletion(user: any, event: Event): void {
  event.stopPropagation();
  if (this.userRole === 'guest') {
    alert('Access Denied: Guest accounts do not have permission to delete user profiles.');
    return;
  }

  const activeAdminId = localStorage.getItem('userId');
  const userConfirmation = confirm(`Are you absolutely sure you want to PERMANENTLY delete ${user.First_name}?`);
  if (!userConfirmation || !activeAdminId) return;

  // Sending a clean flat payload object structure
  const payload = {
    user_id: user.id,
    admin_id: parseInt(activeAdminId, 10)
  };

  this.apiService.deleteUser(payload).subscribe({
    next: (res: any) => {
      if (res.status === 'success') {
        alert(res.message);
        this.loadDashboardStats(); // Refresh table view grid
      } else {
        alert("Operation failed: " + res.message);
      }
    },
    error: (err) => console.error("Error communicating with delete endpoint:", err)
  });
}

  viewUser(user: User): void {
    this.selectedUser.set(user);
    this.showModal.set(true);
    this.activeTab = 'personal';

    this.apiService.getUserProfileSegment('getAcademicRecord', user.id)
      .subscribe(data => this.selectedAcademicRecord.set(data));

    this.apiService.getUserProfileSegment('getCurrentEmployment', user.id)
      .subscribe(data => this.selectedCurrentEmployment.set(data));

    this.apiService.getUserProfileSegment('getFurtherEducation', user.id)
      .subscribe(data => this.selectedFurtherEducation.set(data));

    this.apiService.getUserProfileSegment('social', user.id)
      .subscribe(data => this.selectedSocialContact.set(data));

    this.apiService.getUserProfileSegment('proffesional', user.id)
      .subscribe(data => this.selectedProffesionalMemebership.set(data));

    this.apiService.getUserProfileSegment('history', user.id)
      .subscribe(data => this.selectedEmployementHistory.set(data));
  }

 // Update the toggleVerification method to block Guests
toggleVerification(user: User, event: Event): void {
  event.stopPropagation();
  
  // 🔒 FRONTEND BLOCK FOR GUEST ROLE
  if (this.userRole === 'guest') {
    alert('Access Denied: Guest accounts do not have permission to verify users.');
    return;
  }

  const activeAdminId = localStorage.getItem('userId');
  if (!activeAdminId) {
    alert('Your session has expired. Please log in again.');
    return;
  }

  const targetStatus = user.status === 'Verified' ? 'Pending' : 'Verified';
  const actionConfirmation = confirm(`Change verification status of ${user.First_name} to "${targetStatus}"?`);
  if (!actionConfirmation) return;

  const payload = {
    user_id: user.id,
    status: targetStatus,
    admin_id: parseInt(activeAdminId, 10)
  };

  this.apiService.updateUserVerification(payload).subscribe({
    next: (res: any) => {
      if (res.status === 'success') {
        this.stats.update(currentStats => {
          const updatedUsers = currentStats.users.map(u => {
            if (u.id === user.id) return { ...u, status: targetStatus };
            return u;
          });
          return { 
            ...currentStats, 
            users: updatedUsers,
            verifiedUsers: updatedUsers.filter(u => u.status === 'Verified').length,
            pendingUsers: updatedUsers.filter(u => u.status === 'Pending' || !u.status).length,
            revokedUsers: updatedUsers.filter(u => u.status === 'Revoked').length
          };
        });
        alert(`Status updated successfully to ${targetStatus}.`);
      } else {
        alert("Could not update validation state: " + res.message);
      }
    },
    error: (err) => console.error("Error executing verification updates:", err)
  });
}

// Update the revokeUser method to block Guests
revokeUser(user: User, event: Event): void {
  event.stopPropagation(); 
  
  // 🔒 FRONTEND BLOCK FOR GUEST ROLE
  if (this.userRole === 'guest') {
    alert('Access Denied: Guest accounts do not have permission to revoke access.');
    return;
  }

  const activeAdminId = localStorage.getItem('userId');
  if (!activeAdminId) {
    alert('Your session has expired. Please log in again.');
    return;
  }

  const confirmRevoke = confirm(`Are you absolutely sure you want to revoke and deactivate ${user.First_name}'s account?`);
  if (!confirmRevoke) return;

  const payload = {
    user_id: user.id,
    admin_id: parseInt(activeAdminId, 10)
  };

  this.apiService.revokeUserAccess(payload).subscribe({
    next: (res: any) => {
      if (res.status === 'success') {
        this.stats.update(currentStats => {
          const updatedUsers = currentStats.users.map(u => {
            if (u.id === user.id) return { ...u, status: 'Revoked' };
            return u;
          });
          return {
            ...currentStats,
            users: updatedUsers,
            verifiedUsers: updatedUsers.filter(u => u.status === 'Verified').length,
            pendingUsers: updatedUsers.filter(u => u.status === 'Pending' || !u.status).length,
            revokedUsers: updatedUsers.filter(u => u.status === 'Revoked').length
          };
        });
        alert(`${user.First_name}'s access privileges have been terminated.`);
      } else {
        alert("Revoke operation rejected: " + res.message);
      }
    },
    error: (err) => console.error("Error communicating with revoke endpoint:", err)
  });
}

  submitNewUser(): void {
    const activeAdminId = localStorage.getItem('userId');
    if (!activeAdminId) {
      alert('Session expired. Please log in again.');
      return;
    }

    if (!this.newUserForm.First_name || !this.newUserForm.email) {
      alert('Please fill in all mandatory parameters.');
      return;
    }

    const completePayload = {
      ...this.newUserForm,
      admin_id: parseInt(activeAdminId, 10)
    };

    this.apiService.createAdministrativeUser(completePayload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          alert(res.message);
          this.showUserModal.set(false); 
          this.newUserForm = { First_name: '', email: '', role: 'admin', password: '' };
          this.loadDashboardStats(); 
        } else {
          alert('Rejection: ' + res.message);
        }
      },
      error: (err) => console.error('Communications tracking exception encountered:', err)
    });
  }

  submitAnnouncement(): void {
    if (!this.newAnnouncement.title || !this.newAnnouncement.content) {
      alert('Please fill in both the title and the content.');
      return;
    }

    this.apiService.publishAnnouncement(this.newAnnouncement).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          alert('Announcement published!');
          this.showAnnouncementModal.set(false); 
          this.newAnnouncement = { title: '', content: '' }; 
          this.loadAnnouncements(); 
        } else {
          alert('Failed to post: ' + res.message);
        }
      },
      error: (err) => console.error('Error posting announcement:', err)
    });
  }

  // SEARCH & GRID PAGINATION CONTROLS
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1); 
  }

  setFilter(status: string): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(Number(target.value));
    this.currentPage.set(1);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  // CHARTJS GRAPHICAL RENDERING ENGINES
  private renderCohortChart(distribution: { cohort_name: string; cnt: string | number }[]): void {
    const canvas = this.cohortChartCanvas?.nativeElement;
    if (!canvas) return;
    if (this.cohortChartInstance) this.cohortChartInstance.destroy();
    
    const safeDistribution = distribution || [];
    const labels = safeDistribution.map(item => item.cohort_name || 'Unassigned');
    const counts = safeDistribution.map(item => Number(item.cnt));
    
    this.cohortChartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Registered Alumni',
          data: counts,
          backgroundColor: '#06b6d4', 
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  private renderStatusChart(data: DashboardStats): void {
    if (this.statusChartInstance) this.statusChartInstance.destroy(); 
    const canvas = this.statusChartCanvas?.nativeElement;
    if (!canvas) return;
    
    this.statusChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Verified', 'Pending', 'Revoked'],
        datasets: [{
          data: [data.verifiedUsers, data.pendingUsers, data.revokedUsers],
          backgroundColor: ['#10b981', '#f59e0b', '#e11d48'], 
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { weight: 'bold', size: 11 } } }
        }
      }
    });
  }

  private renderCountyChart(data: DashboardStats): void {
    const canvas = this.countyChartCanvas?.nativeElement;
    if (!canvas) return;
    if (this.countyChartInstance) this.countyChartInstance.destroy();
    
    const countyCounts: { [key: string]: number } = {};
    const employments = data.CurrentEmployment || [];
    employments.forEach(emp => {
      if (emp.work_county) {
        const county = emp.work_county.trim();
        const formattedCounty = county.charAt(0).toUpperCase() + county.slice(1).toLowerCase();
        countyCounts[formattedCounty] = (countyCounts[formattedCounty] || 0) + 1;
      }
    });

    const sortedCounties = Object.entries(countyCounts)
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 7);

    const labels = sortedCounties.map(item => item[0]);
    const chartData = sortedCounties.map(item => item[1]);
    const finalLabels = labels.length ? labels : ['No Data'];
    const finalData = chartData.length ? chartData : [0];

    this.countyChartInstance = new Chart(canvas, {
      type: 'line', 
      data: {
        labels: finalLabels,
        datasets: [{
          label: 'Alumni Employed',
          data: finalData,
          borderColor: '#4f46e5', 
          backgroundColor: 'rgba(79, 70, 229, 0.1)', 
          fill: true, 
          tension: 0.3, 
          pointBackgroundColor: '#4f46e5', 
          pointRadius: 4, 
          pointHoverRadius: 6 
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f1f5f9' } }
        }
      }
    });
  }

  private renderEmploymentPieChart(data: DashboardStats): void {
    const canvas = this.employmentPieCanvas?.nativeElement;
    if (!canvas) return;
    if (this.employmentPieInstance) this.employmentPieInstance.destroy();

    const allUsers = data.users || [];
    const employments = data.CurrentEmployment || [];
    const employedCount = allUsers.filter(user => 
      employments.some((emp: any) => emp.user_id == user.id)
    ).length;
    const unemployedCount = allUsers.length - employedCount;
    
    this.employmentPieInstance = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Employed', 'Unemployed'],
        datasets: [{
          data: [employedCount, unemployedCount],
          backgroundColor: ['#a21caf', '#0891b2'], 
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 16, font: { weight: 'bold', size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed || 0;
                const total = employedCount + unemployedCount;
                const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return ` ${context.label}: ${value} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // DATA STORAGE ARCHIVE EXPORTERS (EXCEL)
  exportAlumniData(filterType: 'Employed' | 'Unemployed' | 'All') {
    const allUsers = this.stats().users || [];
    if (!allUsers || allUsers.length === 0) {
      alert("No alumni records found in memory to export.");
      return;
    }
    
    const currentStats = this.stats() as any;
    const academicRecords = currentStats.academicRecords || currentStats.AcademicRecord || [];
    const employments = currentStats.CurrentEmployment || [];
    const educationRecords = currentStats.FurtherEducation || [];
    const historyRecords = currentStats.EmploymentHistory || currentStats.EmployementHistory || [];
    const professionalMemberships = currentStats.ProfessionalMembership || currentStats.ProffesionalMembership || [];
    const socialSource = currentStats.socialContact || currentStats.SocialContact || [];
    const socialContacts = Array.isArray(socialSource) ? socialSource : Object.values(socialSource);

    const filteredMappedData = allUsers
      .filter(user => {
        const isEmployed = employments.some((emp: any) => emp.user_id == user.id);
        if (filterType === 'Employed') return isEmployed;
        if (filterType === 'Unemployed') return !isEmployed;
        return true;
      })
      .map(user => {
        const academic = academicRecords.find((rec: any) => rec.user_id == user.id);
        const employment = employments.find((emp: any) => emp.user_id == user.id);
        const education = educationRecords.find((edu: any) => edu.user_id == user.id);
        const membership = professionalMemberships.find((mem: any) => mem.user_id == user.id);
        const social = socialContacts.find((soc: any) => soc.user_id == user.id);
        
        const userHistory = historyRecords.filter((hist: any) => {
          if (!hist) return false;
          const histUserId = hist.user_id || hist.User_id;
          return String(histUserId).trim() === String(user.id).trim();
        });
        
        const historySummary = userHistory.length > 0 
          ? userHistory.map((h: any) => `${h.role || 'N/A'} at ${h.employer_name || 'N/A'} (${h.from_date || 'N/A'} to ${h.to_date || 'Present'})`).join(' | ')
          : 'No Prior History';

        return {
          'First Name': user.First_name || 'N/A',
          'Email Address': user.Email || 'N/A',
          'Phone Number': user.Phone_number || 'N/A',
          'Graduation Class': user.Graduation_class || 'N/A',
          'Gender': user.Gender || 'N/A',
          'Account Status': user.status || 'Pending',
          'Employment Status': employment ? 'Employed' : 'Unemployed',
          'Programme Name': academic?.programme_name || 'N/A',
          'Cohort Name': academic?.cohort_name || 'N/A',
          'Registration Number': academic?.reg_number || 'N/A',
          'Current Employer': employment?.employer_name || (employment as any)?.company_name || 'N/A',
          'Job Role / Position': employment?.role || (employment as any)?.job_title || 'N/A',
          'Employment Type': employment?.employment_type || 'N/A',
          'Work County': employment?.work_county || 'N/A',
          'Start Date': employment?.start_date || 'N/A',
          'Past Employment History': historySummary,
          'Further Institution': education?.institution || 'N/A',
          'Field of Study': education?.field_of_study || 'N/A',
          'Year Completed': education?.year_completed || 'N/A',
          'Professional Organization': membership?.organization || 'N/A',
          'Membership ID': membership?.membership_id || 'N/A',
          'LinkedIn URL': social?.linkedin || 'N/A',
          'Home County': social?.home_county || 'N/A',
          'Physical Address': social?.physical_address || 'N/A'
        };
      });

    if (filteredMappedData.length === 0) {
      alert(`No records matched the "${filterType}" filter criteria to export.`);
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(filteredMappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${filterType} Alumni Directory`);
    
    const max_widths = Object.keys(filteredMappedData[0]).map(key => {
      const maxLength = filteredMappedData.reduce((max: number, row: any) => {
        const valStr = String(row[key] || '');
        return valStr.length > max ? valStr.length : max;
      }, key.length);
      return { wch: Math.min(maxLength + 3, 50) }; 
    });

    worksheet['!cols'] = max_widths; 
    XLSX.writeFile(workbook, `SLCMC_${filterType}_Alumni_Report.xlsx`);
  }
}