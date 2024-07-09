import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTransferService } from '../services/data-transfer.service';
import * as Leaflet from 'leaflet';
import { IonDatetime, NavController } from '@ionic/angular';
import { Studente } from '../interfaces/studente';
import { AuthService } from '../services/authService';

@Component({
    selector: 'app-bambino',
    templateUrl: './bambino.page.html',
    styleUrls: ['./bambino.page.scss'],
})
export class BambinoPage implements OnInit, OnDestroy {
    private map!: Leaflet.Map;
    public qrData: Studente = {} as Studente;
    public loaded: boolean = false;
    public isCoordinatesLoaded: boolean = false;
    public isAlertOpen = false;
    public errorMessage: string | null = null;
    public isProcessing: boolean = false;

    public isPopupShown: boolean = false;
    private progressInterval: number | undefined;

    public progress = 0;
    constructor(
        private route: Router,
        private dataTransferService: DataTransferService,
        private authSrv: AuthService
    ) {}

    ngOnInit(): void {
        this.loadChild();
    }

    ionViewDidEnter() {
        this.loadChild()
    }

    presentCustomAlert(errorMessage: string) {
        this.errorMessage = errorMessage;
        this.isAlertOpen = true;
    }

    dismissAlert() {
        this.isAlertOpen = false;
        this.authSrv.removeId();
        this.authSrv.removeToken();
        this.route.navigate(['/home']);
    }

    @ViewChild(IonDatetime) datetime!: IonDatetime;

    loadChild() {
        this.dataTransferService.getStudente().subscribe({
            next: (response) => {
                const studentData: Studente = response.data;
                const formattedTime = studentData.orario.substring(0, 5);

                this.qrData.scuola = studentData.scuola;
                this.qrData.classe = studentData.classe;
                this.qrData.orario = formattedTime;
                this.qrData.fermata = studentData.fermata;
                this.qrData.percorso_id = studentData.percorso_id;
                this.qrData.absenceDays = studentData.absenceDays;
                this.qrData.fermata_coord = studentData.fermata_coord;
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
                        }, 50);
                    });
            },
            error: (error) => {
                console.error('Error fetching student data', error);
                this.presentCustomAlert(
                    error.error.message
                );
            },
        });
    }

    changeChild() {
        this.authSrv.removeToken();
        this.route.navigate(['/genitore']);
    }

    // ionViewDidEnter() {
    //     this.loadChild();
    // this.isPopupShown = true
    // console.log(this.isPopupShown);
    // this.updateDateMessage = 'Caricamento '

    // setTimeout(() => {
    //     this.isPopupShown=false
    //     console.log(this.isPopupShown, 'popup false?');
    //     this.updateDateMessage = ''
    // }, 5000);

    // }

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

        const [latitude, longitude] = this.qrData.fermata_coord;
        let customPoint = Leaflet.icon({
            iconUrl: '../../assets/location-dot-solid (5).svg',
        });

        Leaflet.marker([latitude, longitude], {
            icon: customPoint,
        })
            .addTo(this.map)
            .bindPopup('Questa è la tua fermata');

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
        if (this.isProcessing) return;

        this.isProcessing = true;

        const selectedDate = this.formatDate(new Date(event.detail.value));
        const index = this.qrData.absenceDays?.indexOf(selectedDate);

        if (index === -1) {
            this.qrData.absenceDays?.push(selectedDate);
        } else {
            this.qrData.absenceDays?.splice(index, 1);
        }

        this.isPopupShown = true;
        this.progress = 0;

        if (this.progressInterval !== undefined) {
            clearInterval(this.progressInterval);
        }

        this.progressInterval = window.setInterval(() => {
            this.progress += 0.015;
            if (this.progress >= 1) {
                clearInterval(this.progressInterval);
                this.progressInterval = undefined;
            }
        }, 15);

        setTimeout(() => {
            this.isPopupShown = false;
        }, 1500);

        this.dataTransferService
            .updateStudente({ days: this.qrData.absenceDays })
            .subscribe((response) => {
                this.highlightedDates(response);
                this.reset();
            });

        setTimeout(() => {
            this.isProcessing = false;
        }, 2500);
    }

    reset() {
        this.datetime.reset();
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    ngOnDestroy() {
        this.authSrv.removeId();
        this.authSrv.removeToken();
    }
}
