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
        this.qrData = this.dataTransferService.getData();
    }

    ionViewDidEnter() {
        this.leafletMap();
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
        console.log('isPresent' + this.qrData.assenze, 'utcDay ' + utcDay);
        const isPresent = this.qrData.assenze;
        const formattedDate = date.toDateString();

        for (let i = 0; i < isPresent.length; i++) {
            if (isPresent[i].includes(formattedDate)) {
                return {
                    backgroundColor: 'rgba(200, 37, 29, 1)',
                };
            }
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
}
