import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// 🎓 1. Protects the Alumni Portal (/portal) -> Admins get redirected to /admin
export const alumniGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  if (userId) {
    if (role === 'alumni') {
      return true; // Safe to pass!
    } else if (role === 'admin') {
      router.navigate(['/admin']); // Redirect intrusive Admin to their dashboard desk
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};


export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  if (userId) {
    if (role === 'admin'|| role === 'Guest') {
      return true; // Safe to pass!
    } else if (role === 'alumni') {
      router.navigate(['/portal']); // Redirect intrusive Alumni back to portal safety
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};