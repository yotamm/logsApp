import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import Convert from 'ansi-to-html';

@Directive({
  selector: '[appSanitizeAnsi]'
})
export class SanitizeAnsiDirective {
  private sanitizer = new Convert();

  constructor(private el: ElementRef) {
    setTimeout(() => this.el.nativeElement.innerHTML = this.sanitizer.toHtml(this.el.nativeElement.innerHTML.toString()));
  }
}
