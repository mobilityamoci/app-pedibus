import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../data-transfer.service';
import * as Leaflet from 'leaflet';
import { IonDatetime } from '@ionic/angular';
import { QrData } from '../interfaces/qr-data';

@Component({
    selector: 'app-bambino',
    templateUrl: './bambino.page.html',
    styleUrls: ['./bambino.page.scss'],
})
export class BambinoPage implements OnInit {
    private map!: Leaflet.Map;
    constructor(
        private route: ActivatedRoute,
        private dataTransferService: DataTransferService,
        private qrData: QrData
    ) {}

    @ViewChild(IonDatetime) datetime!: IonDatetime;
    ngOnInit() {
        this.loadChild();
        this.getPercorso(this.qrData.percorso);
    }

    loadChild() {
        this.dataTransferService.getStudente().subscribe(
            (response) => {
                console.log(response);
                // this.qrData.scuola = response.data.scuola;
                // this.qrData.classe = response.data.classe;
                // this.qrData.orario = response.data.orario;
                // this.qrData.fermata = response.data.fermata;
                // this.qrData.percorso = response.data.percorso_id;
                // this.qrData.assenze = response.data.absenceDays;
            },
            (error) => {
                console.error('Error fetching student data', error);
            }
        );
    }

    ionViewDidEnter() {
        const idPercorso = this.qrData.percorso;
        this.getPercorso(idPercorso);
    }

    getPercorso(idPercorso: string) {
        this.dataTransferService
            .getPercorso(idPercorso)
            .subscribe((percorso: any) => {
                const coordinates = percorso.percorso;
                this.leafletMap(coordinates);
            });
    }

    leafletMap(percorso: [number, number][]) {
        // const startPoint = Leaflet.latLng(percorso[0][0], percorso[0][1]);
        // const endPoint = Leaflet.latLng(percorso[percorso.length - 1][0], percorso[percorso.length - 1][1]);

        this.map = Leaflet.map('map');
        Leaflet.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ).addTo(this.map);

        for (let i = 0; i < percorso.length - 1; i++) {
            const start = Leaflet.latLng(percorso[i][0], percorso[i][1]);
            const end = Leaflet.latLng(percorso[i + 1][0], percorso[i + 1][1]);

            const line = Leaflet.polyline([start, end], {
                color: 'rgba(98, 101, 171, 1)',
                weight: 4,
                opacity: 1,
                smoothFactor: 1,
            });
            line.addTo(this.map);
        }

        // Regola view in base alla grandezza del percorso
        const bounds = Leaflet.latLngBounds(
            percorso.map((point) => Leaflet.latLng(point[0], point[1]))
        );
        this.map.fitBounds(bounds);
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
                backgroundColor: 'rgba(225, 122, 122, 1)',
            };
        }

        if (utcDay === 0 || utcDay === 6) {
            return {
                textColor: 'black',
                backgroundColor: 'rgba(225, 122, 122, 1)',
            };
        } else {
            return {
                backgroundColor: 'rgba(122, 225, 138, 1)',
            };
        }
    };

    reset() {
        this.datetime.reset();
    }
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
                this.reset();
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
