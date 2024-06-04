import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[appApplyStyles]',
})
export class ApplyStylesDirective implements AfterViewInit {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit() {
        const shadowRoot =
            this.el.nativeElement.shadowRoot || this.el.nativeElement;

        const intervalId = setInterval(() => {
            const calendarGrid = shadowRoot.querySelector(
                '.calendar-month-grid'
            );
            if (calendarGrid) {
                this.renderer.setStyle(
                    calendarGrid,
                    'grid-template-rows',
                    'repeat(5, 1fr)'
                );
                clearInterval(intervalId)
            }
        }, 2000);
    }
}
