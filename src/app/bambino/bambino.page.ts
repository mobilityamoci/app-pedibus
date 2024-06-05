import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../data-transfer.service';
import * as Leaflet from 'leaflet';

@Component({
    selector: 'app-bambino',
    templateUrl: './bambino.page.html',
    styleUrls: ['./bambino.page.scss'],
})
export class BambinoPage implements OnInit {
    qrData: any;
    private map!: Leaflet.Map;
    constructor(
        private route: ActivatedRoute,
        private dataTransferService: DataTransferService
    ) {}

    ngOnInit() {
        this.loadStudenti(this.qrData.id);
        this.leafletMap();
    }

    ionViewDidEnter() {
        this.leafletMap();
    }

    loadStudenti(studentId: string) {
        this.dataTransferService.getStudente(studentId).subscribe((data) => {
            this.qrData = data;
        });
    }

    leafletMap() {
        const percorso = this.qrData.percorso;
        const center = percorso[0];
        this.map = Leaflet.map('map').setView(center, 13);
        Leaflet.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ).addTo(this.map);

        for (let i = 0; i < percorso.length; i++) {
            const startPoint = Leaflet.latLng(percorso[i][0], percorso[i][1]);
            const endPoint = Leaflet.latLng(
                percorso[i + 1][0],
                percorso[i + 1][1]
            );

            const line1 = Leaflet.polyline([startPoint, endPoint], {
                color: 'red',
                weight: 3,
                opacity: 0.8,
                smoothFactor: 1,
            });
            line1.addTo(this.map);
        }
    }

    isWeekday = (dateString: string) => {
        const date = new Date(dateString);
        const utcDay = date.getUTCDay();

        return utcDay !== 0 && utcDay !== 6;
    };

    highlightedDates = (isoString: any) => {
        const date = new Date(isoString);
        const utcDay = date.getUTCDay();
        const formattedDate = date.toDateString();
        const isPresent = this.qrData.assenze;

        if (isPresent.includes(formattedDate)) {
            return {
                backgroundColor: 'rgba(200, 37, 29, 1)',
            };
        }

        if (utcDay === 0 || utcDay === 6) {
            return {
                textColor: 'black',
                backgroundColor: 'rgba(200, 37, 29, 1)',
            };
        } else {
            return {
                backgroundColor: 'rgba(122, 225, 138, 1)',
            };
        }
    };

    onDateChange(event: any) {
        const selectedDate = new Date(event.detail.value).toDateString();
        const index = this.qrData.assenze.indexOf(selectedDate);

        if (index === -1) {
            this.qrData.assenze.push(selectedDate);
        } else {
            this.qrData.assenze.splice(index, 1);
        }

        this.dataTransferService
            .updateStudente(this.qrData.id, this.qrData)
            .subscribe((response) => {
                this.updateHighlightedDates();
            });
    }

    updateHighlightedDates() {
        this.highlightedDates = (isoString: any) => {
            const date = new Date(isoString);
            const formattedDate = date.toDateString();
            const isPresent = this.qrData.assenze;

            if (isPresent.includes(formattedDate)) {
                return {
                    backgroundColor: 'rgba(200, 37, 29, 1)',
                };
            }

            if (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
                return {
                    textColor: 'black',
                    backgroundColor: 'rgba(200, 37, 29, 1)',
                };
            } else {
                return {
                    backgroundColor: 'rgba(122, 225, 138, 1)',
                };
            }
        };
    }
}
