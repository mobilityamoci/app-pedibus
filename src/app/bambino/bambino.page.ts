import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../data-transfer.service';
import * as Leaflet from 'leaflet';
import { IonDatetime, NavController } from '@ionic/angular';
import { Studente } from '../interfaces/studente';

@Component({
    selector: 'app-bambino',
    templateUrl: './bambino.page.html',
    styleUrls: ['./bambino.page.scss'],
})
export class BambinoPage {
    private map!: Leaflet.Map;
    public qrData: Studente = {} as Studente;
    public loaded: boolean = false;
    public isCoordinatesLoaded: boolean = false;
    public alertButtons: any[];
    public isAlertOpen = true;
    public errorMessage: string | null = null;

    constructor(
        private dataTransferService: DataTransferService,
        private navControl: NavController
    ) {
        this.alertButtons = [
            {
                text: 'Torna alla Home',
                handler: () => {
                    this.navControl.navigateRoot('/home');
                },
            },
        ];
    }

    @ViewChild(IonDatetime) datetime!: IonDatetime;

    loadChild() {
        this.dataTransferService.getStudente().subscribe({
            next: (response) => {
                const studentData: Studente = response.data;

                this.qrData.scuola = studentData.scuola;
                this.qrData.classe = studentData.classe;
                this.qrData.orario = studentData.orario;
                this.qrData.fermata = studentData.fermata;
                this.qrData.percorso_id = studentData.percorso_id;
                this.qrData.absenceDays = studentData.absenceDays;
                console.log('Percorso ID:', this.qrData.percorso_id);
                console.log('Student Data:', studentData);

                this.dataTransferService
                    .getPercorso(this.qrData.percorso_id)
                    .subscribe((response: any) => {
                        const coordinates = response.data.percorso;
                        console.log(coordinates);
                        this.loaded = true;
                        this.isCoordinatesLoaded = true;
                        console.log(this.loaded);

                        setTimeout(() => {
                            this.leafletMap(coordinates);
                        }, 1000);
                    });
            },
            error: (error) => {
                console.error('Error fetching student data', error);
                this.errorMessage = error
                this.isAlertOpen = true
            },
        });
    }

    ionViewDidEnter() {
        this.loadChild();
    }

    leafletMap(percorso: [number, number][]) {
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

        const bounds = Leaflet.latLngBounds(
            percorso.map((point) => Leaflet.latLng(point[0], point[1]))
        );
        this.map.fitBounds(bounds);
    }

    isWeekday = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const utcDay = date.getUTCDay();

        date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return date >= today && today && utcDay !== 0 && utcDay !== 6;
    };

    highlightedDates = (isoString: any) => {
        const date = new Date(isoString);
        const formattedDate = this.formatDate(date);
        const isPresent = this.qrData.absenceDays || [];
        const today = new Date();
        const utcDay = date.getUTCDay();

        date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

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
        }

        if (date < today) {
            return {
                backgroundColor: 'rgba(169, 169, 169, 1)',
            };
        }

        return {
            backgroundColor: 'rgba(122, 225, 138, 1)',
        };
    };

    onDateChange(event: any) {
        const selectedDate = this.formatDate(new Date(event.detail.value));
        const index = this.qrData.absenceDays?.indexOf(selectedDate);

        if (index === -1) {
            this.qrData.absenceDays?.push(selectedDate);
        } else {
            this.qrData.absenceDays?.splice(index, 1);
        }

        this.dataTransferService
            .updateStudente({ days: this.qrData.absenceDays })
            .subscribe((response) => {
                this.highlightedDates(response);
                console.log(response);

                this.reset();
            });
    }

    // updateHighlightedDates() {
    //     this.highlightedDates = (isoString: any) => {
    //         const date = new Date(isoString);
    //         const formattedDate = this.formatDate(date);
    //         const isPresent = this.qrData.absenceDays || [];
    //         const today = new Date();
    //         const utcDay = date.getUTCDay();

    //         date.setHours(0, 0, 0, 0);
    //         today.setHours(0, 0, 0, 0);

    //         console.log(isPresent);

    //         if (isPresent.includes(formattedDate)) {
    //             return {
    //                 backgroundColor: 'rgba(225, 122, 122, 1)',
    //             };
    //         }

    //         if (utcDay === 0 || utcDay === 6) {
    //             return {
    //                 textColor: 'black',
    //                 backgroundColor: 'rgba(225, 122, 122, 1)',
    //             };
    //         }

    //         if (date < today) {
    //             return {
    //                 backgroundColor: 'rgba(169, 169, 169, 1)',
    //             };
    //         }

    //         return {
    //             backgroundColor: 'rgba(122, 225, 138, 1)',
    //         };
    //     };
    // }

    reset() {
        this.datetime.reset();
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
