import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Home } from './component/home/home';
import { Portal } from './component/portal/portal';
import { Admin } from './component/admin/admin';
import { OtpVerify } from './verify-otp/verify-otp';
import { alumniGuard, adminGuard } from './auth-guard';
import { ForgotPassword } from './component/forgot-passowrd/forgot-passowrd';

export const routes: Routes = [
  // Public Routes
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
   { path: 'resetpassword', component: ForgotPassword },
   { path: 'verify', component: OtpVerify},
  
  //  Role-Protected Internal Workspaces
  { 
    path: 'portal', 
    component: Portal, 
    canActivate: [alumniGuard] // Only allows matching Alumni members
  },
  { 
    path: 'admin', 
    component: Admin, 
    canActivate: [adminGuard]  //  Only allows matching System Administrators
  }
];