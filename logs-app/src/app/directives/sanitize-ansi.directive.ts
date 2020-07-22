import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import Convert from 'ansi-to-html';

@Directive({
  selector: '[appSanitizeAnsi]'
})
export class SanitizeAnsiDirective {
  private sanitizer = new Convert();

  constructor(private el: ElementRef,
              private renderer: Renderer2) { }

  @Input('appSanitizeAnsi') set sanitize(text: string) {
    const sanitized = this.sanitizer.toHtml(text);
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', sanitized);
  }
}
