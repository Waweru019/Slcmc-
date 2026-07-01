import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(url: string | null, type: 'image' | 'resource' = 'resource'): SafeUrl | SafeResourceUrl {
    if (!url) return '';
    
    // 🌟 Use the correct bypass strategy depending on the element target
    if (type === 'image') {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}