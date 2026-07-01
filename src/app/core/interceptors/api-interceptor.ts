import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if the request is already a full URL (e.g., loading an external asset)
  const isAbsoluteUrl = req.url.startsWith('http://') || req.url.startsWith('https://');

  if (!isAbsoluteUrl) {
    // Clone the request and prepend the centralized API URL
    const clonedRequest = req.clone({
      url: `${environment.apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
    });
    return next(clonedRequest);
  }

  return next(req);
};