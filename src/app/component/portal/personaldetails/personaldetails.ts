import { Component, OnInit, signal, effect, inject } from '@angular/core'; 
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { ApiService } from '@core/services/api';

export interface Programme { id: number; programme: string; }
export interface Cohort { id: number; programme_id: number; cohort: string; }

@Component({
  selector: 'app-personaldetails', 
  templateUrl: './personaldetails.html', 
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, FormsModule] // HttpClientModule can be removed if provided globally
}) 
export class Personaldetails implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  selectedFile: File | null = null; 
  registerForm!: FormGroup; 
  academicForm!: FormGroup; 
  employmentForm!: FormGroup; 
  historyForm!: FormGroup; 
  furthereducation!: FormGroup; 
  membership!: FormGroup; 
  socialForm!: FormGroup; 
  currentStep: number = 1; 
  successMsg = '';
  totalSteps = 7;
  imagePreview: string | null = null;

  showEmploymentCheckModal = signal<boolean>(false);
  programmesList = signal<Programme[]>([]);
  cohortsList = signal<Cohort[]>([]);
  profileCompleteness = signal<number>(0);
  isNotEmployed = signal<boolean>(false);

  sectionCompletion = signal<{ [key: number]: boolean }>({
    1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false
  });

  get progress(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }
  
  counties: string[] = [ 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu' ];

  constructor() {
    effect(() => {
      const isEmploymentComplete = this.sectionCompletion()[3];
      if (!isEmploymentComplete) {
        this.showEmploymentCheckModal.set(true);
      }
    });
  }

  ngOnInit(): void { 
    this.initForms();
    this.loadProgrammesDropdown();
    this.loadCohortDropdown();
    this.fetchAndEvaluateProfile();
  } 

  private initForms(): void {
    this.registerForm = this.fb.group({ 
      First_name:[''], Dob:[''], Gender:[''], id_no:[''], Graduation_class:[''], Phone_number:[''], Email:['']
    }); 
    this.academicForm = this.fb.group({ 
      programme_name: ['', Validators.required], year_joined: ['', Validators.required], cohort_name: ['', Validators.required], reg_number: ['', Validators.required], graduation_year: ['', Validators.required] 
    }); 
    this.employmentForm = this.fb.group({ 
      employer_name: ['', Validators.required], role: ['', Validators.required], employment_type: ['', Validators.required], work_county: ['', Validators.required], start_date: ['', Validators.required] 
    }); 
    this.historyForm = this.fb.group({ employers: this.fb.array([this.createEmployerGroup()]) }); 
    this.furthereducation = this.fb.group({ institution: ['', Validators.required], field_of_study: ['', Validators.required], year_completed: ['', Validators.required] }); 
    this.membership = this.fb.group({ organization: ['', Validators.required], membership_id: ['', Validators.required] }); 
    this.socialForm = this.fb.group({ linkedin: ['', Validators.required], physical_address: ['', Validators.required], home_county: ['', Validators.required] }); 
  }

  fetchAndEvaluateProfile(): void {
    const userId = localStorage.getItem('userId'); 
    if (!userId) return; 

    this.apiService.getProfile(Number(userId)).subscribe({ 
      next: (res: any) => { 
        if (res.status === 'success') { 
          if (res.user) this.registerForm.patchValue(res.user); 
          if (res.academic) this.academicForm.patchValue(res.academic); 
          if (res.current) this.employmentForm.patchValue(res.current); 
          
          if (res.history && Array.isArray(res.history)) {
            this.employersArray.clear(); 
            res.history.forEach((h: any) => this.employersArray.push(this.fb.group(h))); 
          }
          
          if (res.education) this.furthereducation.patchValue(res.education); 
          if (res.membership) this.membership.patchValue(res.membership); 
          if (res.social) this.socialForm.patchValue(res.social); 

          this.calculateCompleteness(res);
        } 
      } 
    });
  }

  // ========================= 
  // STEP SUBMISSION METHODS 
  // ========================= 
  
  submitStep1(): void { 
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    
    const formData = new FormData();
    formData.append('step', '1');
    formData.append('user_id', localStorage.getItem('userId') ?? '');
    formData.append('First_name', this.registerForm.value.First_name || '');
    formData.append('Dob', this.registerForm.value.Dob || '');
    formData.append('Gender', this.registerForm.value.Gender || '');
    formData.append('Email', this.registerForm.value.Email || '');
    formData.append('Phone_number', this.registerForm.value.Phone_number || '');
    formData.append('id_no', this.registerForm.value.id_no || '');
    formData.append('Graduation_class', this.registerForm.value.Graduation_class || '');
    formData.append('Password', 'defaultOrFieldPassword'); 

    if (this.selectedFile) { 
      formData.append('photo', this.selectedFile, this.selectedFile.name); 
    } 

    this.apiService.submitStep1(formData).subscribe({ 
      next: (res: any) => {
        if (res.status === 'success') {
          this.successMsg = res.message;
          setTimeout(() => this.successMsg = '', 3000);
          this.fetchAndEvaluateProfile();
          this.nextStep();
        }
      }, 
      error: (err) => console.error(err) 
    }); 
  } 

  submitStep2(): void { 
    if (this.academicForm.invalid) { this.academicForm.markAllAsTouched(); return; } 
    const payload = { step: 2, user_id: localStorage.getItem('userId'), ...this.academicForm.value }; 
    
    this.apiService.submitStep2(payload).subscribe({ 
      next: (res: any) => { 
        if (res.status === 'success') {
          alert(res.message); 
          this.fetchAndEvaluateProfile();
          this.nextStep(); 
        } 
      }, 
      error: (err) => console.error(err) 
    }); 
  } 

  submitStep3(): void {
    const payload = { step: 3, user_id: localStorage.getItem('userId'), ...this.employmentForm.value };
    this.apiService.submitStep3(payload).subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') { 
          alert(res.message);
          this.fetchAndEvaluateProfile();
          this.nextStep(); 
        }
      },
      error: (err) => console.error(err)
    });
  }

  submitStep4(): void { 
    const payload = { step: 4, user_id: localStorage.getItem('userId'), employers: this.employersArray.value };
    this.apiService.submitStep4(payload).subscribe({ 
      next: (res: any) => { 
        if(res.status === 'success') {
          this.fetchAndEvaluateProfile();
          this.nextStep();
        } 
      }, 
      error: (err) => console.error(err) 
    }); 
  }

  submitStep5(): void { 
    const payload = { step: 5, user_id: localStorage.getItem('userId'), ...this.furthereducation.value };
    this.apiService.submitStep5(payload).subscribe({ 
      next: (res: any) => { 
        if(res.status === 'success') {
          this.fetchAndEvaluateProfile();
          this.nextStep();
        } 
      }, 
      error: (err) => console.error(err) 
    }); 
  } 

  submitStep6(): void { 
    const payload = { step: 6, user_id: localStorage.getItem('userId'), ...this.membership.value };
    this.apiService.submitStep6(payload).subscribe({ 
      next: (res: any) => { 
        if(res.status === 'success') {
          this.fetchAndEvaluateProfile();
          this.nextStep();
        } 
      }, 
      error: (err) => console.error(err) 
    }); 
  } 

  submitStep7(): void { 
    const payload = { step: 7, user_id: localStorage.getItem('userId'), ...this.socialForm.value };
    this.apiService.submitStep7(payload).subscribe({ 
      next: (res: any) => { 
        if(res.status === 'success') {
          this.fetchAndEvaluateProfile();
          alert("Profile Completed Successfully!"); 
        } 
      }, 
      error: (err) => console.error(err) 
    }); 
  } 

  loadProgrammesDropdown(): void {
    this.apiService.getProgrammes().subscribe({
      next: (data) => this.programmesList.set(data),
      error: (err) => console.error(err)
    });
  }

  loadCohortDropdown(): void {
    this.apiService.getCohorts().subscribe({
      next: (data) => this.cohortsList.set(data),
      error: (err) => console.error(err)
    });
  }

  // --- Modal Helpers & Setup Utilities ---
  handleEmploymentResponse(isEmployed: boolean): void {
    this.showEmploymentCheckModal.set(false);
    if (isEmployed) {
      this.triggerEmploymentEditMode(); 
    } else {
      this.isNotEmployed.set(true);
      this.sectionCompletion.update(state => ({ ...state, 3: true }));
      this.nextStep(); 
    } 
  }

  resetEmploymentStatus(): void {
    this.isNotEmployed.set(false);
    this.sectionCompletion.update(state => ({ ...state, 3: false }));
    this.triggerEmploymentEditMode();
  }

  triggerEmploymentCheck(): void { this.showEmploymentCheckModal.set(true); }
  triggerEmploymentEditMode() { }
  get employersArray(): FormArray { return this.historyForm.get('employers') as FormArray; } 
  createEmployerGroup(): FormGroup { 
    return this.fb.group({ employer_name: ['', Validators.required], role: ['', Validators.required], from_date: ['', Validators.required], to_date: ['', Validators.required] }); 
  } 
  addEmployer(): void { this.employersArray.push(this.createEmployerGroup()); } 
  removeEmployer(index: number): void { this.employersArray.removeAt(index); } 
  nextStep(): void { if (this.currentStep < 7) this.currentStep++; } 
  prevStep(): void { if (this.currentStep > 1) this.currentStep--; } 

  calculateCompleteness(res: any): void {
    let score = 0;
    const completionMap = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };
    if (res.user && res.user.First_name && res.user.Email && res.user.Phone_number) { score += 15; completionMap[1] = true; }
    if (res.academic && res.academic.programme_name && res.academic.reg_number) { score += 15; completionMap[2] = true; }
    if (res.current && res.current.employer_name && res.current.role) { score += 14; completionMap[3] = true; }
    if (res.history && res.history.length > 0 && res.history[0].employer_name) { score += 14; completionMap[4] = true; }
    if (res.education && res.education.institution && res.education.field_of_study) { score += 14; completionMap[5] = true; }
    if (res.membership && res.membership.organization && res.membership.membership_id) { score += 14; completionMap[6] = true; }
    if (res.social && res.social.linkedin && res.social.home_county) { score += 14; completionMap[7] = true; }
    this.profileCompleteness.set(score);
    this.sectionCompletion.set(completionMap);
  }

  onFileSelected(event: Event) { 
    const target = event.target as HTMLInputElement; 
    if (target && target.files && target.files.length > 0) { 
      const file = target.files[0];
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert(`File too large.`);
        return;
      }
      this.selectedFile = file; 
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    } 
  } 
}