import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../data-transfer.service';
import * as Leaflet from 'leaflet';
@Component({
    selector: 'app-fermate',
    templateUrl: './fermate.page.html',
    styleUrls: ['./fermate.page.scss'],
})
export class FermatePage implements OnInit {
    qrData: any;
    fermate?: any[];
    studenti?: any[];
    private map!: Leaflet.Map;
    constructor(private dataTransferService: DataTransferService) {}

    ngOnInit(): void {
        this.qrData = this.dataTransferService.getData();
        this.dataTransferService
            .getFermata(this.qrData.id)
            .subscribe((data) => {
                this.qrData = data;
                this.fermate = this.qrData.fermate;
                this.studenti = this.qrData.fermate.studenti;
            });
    }

    ngAfterViewInit(): void {
        this.calculateAndSetHeights();
    }

    ngOnDestroy(): void {
        window.removeEventListener(
            'resize',
            this.calculateAndSetHeights.bind(this)
        );
    }

    private calculateAndSetHeights(): void {
        const drawersSection = document.querySelector(
            '.drawers'
        ) as HTMLElement;
        const labels = drawersSection.querySelectorAll('label');
        const drawerContents =
            drawersSection.querySelectorAll('.drawer-content');

        let availableHeight = drawersSection.offsetHeight;
        labels.forEach((label) => {
            availableHeight -= (label as HTMLElement).offsetHeight;
        });

        const contentHeight = availableHeight / drawerContents.length;
        drawersSection.style.setProperty(
            '--content-height',
            `${contentHeight}px`
        );
    }
}
