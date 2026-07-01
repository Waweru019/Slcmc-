import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api';

@Component({
  selector: 'app-privacsettings',
  templateUrl: './privacsettings.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class Privacsettings implements OnInit {
  private apiService = inject(ApiService);

  // Aligned keys explicitly to match your PHP file parameters
  settings = {
    show_email: true,
    show_phone: false,
    show_employment: true,
    show_education: true,
    show_membership: false,
    show_social: false,    
    show_contact: false, 
    show_further_education: false   
  };

  ngOnInit(): void {
    // Optional: Add logic here later to GET current settings when the component loads
  }

  savePrivacy() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Session expired. Please log in again.");
      return;
    }

    // Explicitly construct the payload matching what PHP expects
    const payload = {
      user_id: Number(userId),
      ...this.settings
    };

    console.log("Sending privacy payload:", payload);

    this.apiService.updatePrivacySettings(payload).subscribe({
      next: (res: any) => {
        console.log("Response from server:", res);
        if (res.status === 'success') {
          alert("Privacy settings updated successfully!");
        } else {
          alert("Error: " + res.message);
        }
      },
      error: (err) => {
        console.error("HTTP Error updating settings:", err);
        alert("Network or server connection error.");
      }
    });
  }
}