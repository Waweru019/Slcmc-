import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpParams } from '@angular/common/http'; 
import { ApiService } from '@core/services/api';

export interface Programme {
  id?: number;
  programme: string;
}

export interface Cohort {
  id?: number;
  programme_id: number;
  cohort: string;
  programme_name?: string;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programs.html',
  styleUrl: './programs.css',
})
export class Programs implements OnInit {
  private apiService = inject(ApiService);

  // Form State variables using standard strings for stable ngModel integration
  newProgrammeName = '';
  newCohortName = '';
  selectedProgrammeId: number | null = null;
  
  programmesList = signal<Programme[]>([]);
  cohortsList = signal<Cohort[]>([]);
  mediaRecords = signal<any[]>([]);
  isModalOpen = signal<boolean>(false);

  // Form bound variables
  inputTitle = '';
  inputAltText = '';
  selectedFileReference: File | null = null;
  selectedFileLabel = '';

  ngOnInit(): void {
    this.loadProgrammesDropdown();
    this.loadCohortDropdown();
  }

  submitProgramme(): void {
    const name = this.newProgrammeName.trim();
    if (!name) {
      alert('Please enter a programme title first.');
      return;
    }

    const body = new HttpParams().set('programme', name);
    this.apiService.addProgramme(body).subscribe({
      next: (res) => {
        console.log('Programme added successfully:', res);
        this.newProgrammeName = '';
        this.loadProgrammesDropdown();
        alert('Programme registered successfully!');
      },
      error: (err) => console.error('Error adding programme:', err)
    });
  }

  submitCohort(): void {
    const cohortName = this.newCohortName.trim();
    const progId = this.selectedProgrammeId;
    if (!cohortName || !progId) {
      alert('Please enter a cohort class title and select its associated programme.');
      return;
    }

    const body = new HttpParams()
      .set('cohort', cohortName)
      .set('programme_id', String(progId));

    this.apiService.addCohort(body).subscribe({
      next: (res) => {
        console.log('Cohort linked and added successfully:', res);
        this.newCohortName = '';
        alert('Cohort class added and mapped to programme successfully!');
      },
      error: (err) => console.error('Error adding cohort:', err)
    });
  }

  loadProgrammesDropdown(): void {
    this.apiService.getProgrammes().subscribe({
      next: (data) => this.programmesList.set(data),
      error: (err) => console.error('Error loading programmes list:', err)
    });
  }

  loadCohortDropdown(): void {
    this.apiService.getCohorts().subscribe({
      next: (data) => this.cohortsList.set(data),
      error: (err) => console.error('Error loading cohorts list:', err)
    });
  }

  getGroupedProgrammes() {
    const programmes = this.programmesList();
    const cohorts = this.cohortsList();
    return programmes.map(prog => {
      return {
        ...prog,
        cohorts: cohorts.filter(c => Number(c.programme_id) === Number(prog.id))
      };
    });
  }

  onMediaFileSelected(event: any) {
    const rawFile = event.target.files[0];
    if (rawFile) {
      this.selectedFileReference = rawFile;
      this.selectedFileLabel = rawFile.name;
    }
  }

  toggleModalState(isOpen: boolean) {
    this.isModalOpen.set(isOpen);
    if (!isOpen) {
      this.inputTitle = '';
      this.inputAltText = '';
      this.selectedFileReference = null;
      this.selectedFileLabel = '';
    }
  }

  executeFormUpload() {
    if (!this.inputTitle.trim() || !this.inputAltText.trim() || !this.selectedFileReference) {
      alert("Please ensure all properties and target media components are structured fully.");
      return;
    }

    const networkPayload = new FormData();
    networkPayload.append('title', this.inputTitle.trim());
    networkPayload.append('alt_text', this.inputAltText.trim());
    networkPayload.append('media_file', this.selectedFileReference);

    this.apiService.saveMediaAsset(networkPayload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toggleModalState(false);
          alert("Media profile record asset updated perfectly!");
        } else {
          alert("Upload execution error encountered: " + res.message);
        }
      },
      error: (err) => console.error("Media multi-part stream operation aborted:", err)
    });
  }
}