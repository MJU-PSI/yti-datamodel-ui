import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'trustAsHtml'
})
export class TrustAsHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}
