import { Directive, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMouseMove]'
})
export class MouseMoveDirective {

  private timeoutId: any;

  constructor(private renderer: Renderer2) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    clearTimeout(this.timeoutId);
    this.renderer.removeClass(document.body, 'idle');

    this.timeoutId = setTimeout(() => {
      this.renderer.addClass(document.body, 'idle');
    }, 2000);  
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.renderer.addClass(document.body, 'idle');
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.renderer.removeClass(document.body, 'idle');
  }
}
