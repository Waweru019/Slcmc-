import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programme, Cohort } from '../../component/portal/personaldetails/personaldetails';
import { UserProfileResponses } from '../../component/portal/dashboard/dasboard'; 
import { HttpParams } from '@angular/common/http';

export interface UserProfileResponse {
  status: string;
  user: any;
  academic: any;
  current: any;
  history: any[];
  education: any;
  membership: any;
  social: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // 🌟 FIX: Point ALL endpoints to your active backend IP so cookies match up!
  private baseUrl = 'http://192.168.0.115:8080';
  private adminUrl = `${this.baseUrl}/admin.php`;
  private networkPhpUrl = 'http://192.168.0.115:8080';

  getTotalUnreadCount(userId: number): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}?action=getTotalUnreadCount&user_id=${userId}`);
  }

  getPortalProfile(userId: number): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponses>(`${this.adminUrl}?action=fetch_profile&user_id=${userId}`);
  }

  getAnnouncements(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}?action=getAnnouncements`);
  }

  getAnnouncementCount(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}?action=getAnnouncementCount`);
  }

  logoutServer(): Observable<any> {
    return this.http.post<any>(`${this.adminUrl}?action=logout`, {});
  }

 
// Add this method inside your ApiService class (src/app/core/services/api.ts)
getAlumniDirectoryPaginated(loggedInUserId: number, page: number = 1, limit: number = 8): Observable<any> {
  return this.http.get<any>(
    `${this.adminUrl}?action=getAlumniinfo&exclude_id=${loggedInUserId}&page=${page}&limit=${limit}`
  );
}
  getProfile(userId: number): Observable<any> { 
    return this.http.get(`${this.adminUrl}?action=fetch_profile&user_id=${userId}`); 
  }
  getDashboardProfile(userId: number): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(
      `${this.adminUrl}?action=fetch_profile&user_id=${userId}`,
      { withCredentials: true }
    );
  }

  getAlumni(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-alumni.php`);
  }
  
  login(credentials: any): Observable<any> {
    return this.http.post<any>(
      `${this.adminUrl}?action=login`, 
      credentials,
      { withCredentials: true } 
    );
  }
  // Add these inside your ApiService class (src/app/core/services/api.ts)

getAlumniDirectory(userId: number): Observable<any> {
  return this.http.get<any>(`${this.adminUrl}?action=getAlumniDirectory&exclude_id=${userId}`);
}

getChatHistory(userId: number, recipientId: number, lastTimestamp: string = ''): Observable<any> {
  let url = `${this.adminUrl}?action=getChatHistory&user_id=${userId}&recipient_id=${recipientId}`;
  if (lastTimestamp) {
    url += `&last_timestamp=${encodeURIComponent(lastTimestamp)}`;
  }
  return this.http.get<any>(url);
}

markAsRead(payload: { user_id: number; sender_id: number }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=markAsRead`, payload);
}

sendMessage(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=sendMessage`, formData);
}

deleteMessages(payload: { user_id: number; message_ids: number[] }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=deleteMessages`, payload);
}

clearChat(payload: { user_id: number; recipient_id: number }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=clearChat`, payload);
}


// Add this method inside your ApiService class (src/app/core/services/api.ts)
updatePrivacySettings(payload: any): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=privacySettingsAlumni`, payload);
}
  getProgrammes(): Observable<Programme[]> {
    return this.http.get<Programme[]>(`${this.adminUrl}?action=getProgrammes`);
  }

  getCohorts(): Observable<Cohort[]> {
    return this.http.get<Cohort[]>(`${this.adminUrl}?action=getcohort`);
  }

  // --- Step Form Submissions (Ensure withCredentials if these steps check your session!) ---
  submitStep1(formData: FormData): Observable<any> {
    return this.http.post(`${this.adminUrl}?action=addPersonalDetails`, formData, { withCredentials: true });
  }

  submitStep2(payload: any): Observable<any> {
    return this.http.post(`${this.adminUrl}?action=addacademicrecord`, payload, { withCredentials: true });
  }

  submitStep3(payload: any): Observable<any> {
    return this.http.post(`${this.adminUrl}?action=addCurrentEmployment`, payload, { withCredentials: true });
  }

  submitStep4(payload: any): Observable<any> {
    return this.http.post(`${this.adminUrl}?action=addEmploymentHistory`, payload, { withCredentials: true });
  }

  submitStep5(payload: any): Observable<any> {
    return this.http.post(`${this.adminUrl}?action=addFurtherEducation`, payload, { withCredentials: true });
  }

  submitStep6(payload: any): Observable<any> {
    return this.http.post(`${this.adminUrl}?action=addProfessionalMembership`, payload, { withCredentials: true });
  }

  submitStep7(payload: any): Observable<any> {
    return this.http.post(`${this.adminUrl}?action=addSocialContact`, payload, { withCredentials: true });
  }
  // Add these methods inside your ApiService class (src/app/core/services/api.ts)

getDashboardStats(): Observable<any> {
  return this.http.get<any>(`${this.adminUrl}?action=stats`);
}



getAuditLogs(): Observable<any> {
  return this.http.get<any>(`${this.adminUrl}?action=getAuditLogs`);
}

getUserProfileSegment(action: string, userId: number): Observable<any> {
  return this.http.get<any>(`${this.adminUrl}?action=${action}&user_id=${userId}`);
}

updateUserVerification(payload: { user_id: number; status: string; admin_id: number }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=verify`, payload);
}

revokeUserAccess(payload: { user_id: number; admin_id: number }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=revoke`, payload);
}

createAdministrativeUser(payload: any): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=createUser`, payload);
}

publishAnnouncement(payload: { title: string; content: string }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=createAnnouncement`, payload);
}
// Add these methods inside your ApiService class (src/app/core/services/api.ts)



addProgramme(body: HttpParams): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}/admin.php?action=addProgramme`, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

addCohort(body: HttpParams): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=addCohort`, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

saveMediaAsset(payload: FormData): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=saveMediaAsset`, payload);
}

forgotPassword(payload: { email: string }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=forgotPassword`, payload);
}

resetPassword(payload: { token: string; new_password: string }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=resetPassword`, payload);
}
// Add this method inside your ApiService class (src/app/core/services/api.ts)
registerAlumniUser(payload: any): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=register`, payload);
}
// Add these methods inside your ApiService class (src/app/core/services/api.ts)

/**
 * Updates a user profile registry record (Admin Override context)
 * @param payload Object containing user_id, admin_id, and updated profile fields
 */
editUser(payload: {
  user_id: number;
  admin_id: number;
  First_name: string;
  email: string;
  Phone_number: string;
  Gender: string;
  Graduation_class: string;
}): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=editUser`, payload);
}

/**
 * Permanently removes a user account record from the registry tables
 * @param payload Object containing the user_id and authorization admin_id
 */
deleteUser(payload: { user_id: number; admin_id: number }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=deleteUser`, payload);
}
verifyOtp(payload: { user_id: number; otp_code: string }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=verify_otp`, payload);
}

resendOtp(payload: { user_id: number }): Observable<any> {
  return this.http.post<any>(`${this.adminUrl}?action=resend_otp`, payload);
}

}