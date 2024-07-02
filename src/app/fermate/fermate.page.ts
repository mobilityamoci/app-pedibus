import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataTransferService } from '../data-transfer.service';
import * as Leaflet from 'leaflet';
import { Guardian } from '../interfaces/Guardian';
import { AuthService } from '../authService';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
    selector: 'app-fermate',
    templateUrl: './fermate.page.html',
    styleUrls: ['./fermate.page.scss'],
})
export class FermatePage implements OnInit, OnDestroy {
    qrData: any;
    stops: {
        orario: string;
        indirizzo: string;
        nr_children: string;
        coordinates: [number, number];
    }[] = [];
    public loaded: boolean = false;
    public isCoordinatesLoaded: boolean = false;
    public isAlertOpen = false;

    errorMessage: string | null = null;
    private map!: Leaflet.Map;
    constructor(
        private dataTransferService: DataTransferService,
        private authSrv: AuthService,
        private navControl: NavController
    ) {}

    ngOnInit(): void {
        this.loadGuardian();
        // this.dataTransferService
        //     .getFermata(this.qrData.id)
        //     .subscribe((data) => {
        //         console.log(this.qrData.id + '<<<<<<<<<ID>>>>>>>>>>>>>>>');

        //         this.qrData = data;

        //     });
    }

    presentCustomAlert(errorMessage: string) {
        this.errorMessage = errorMessage;
        this.isAlertOpen = true;
    }

    onModalDismiss() {
        this.isAlertOpen = false;
    }

    dismissAlert() {
        this.isAlertOpen = false;
    }

    loadGuardian() {
        const id = this.authSrv.getId();

        if (!id) {
            this.loaded = true;
            this.errorMessage =
                'ID non presente, si prega di scansionare il codice QR di nuovo';
            return;
        }

        this.dataTransferService.getFermata(id).subscribe({
            next: (response) => {
                if (response.error) {
                    this.loaded = true;
                    this.errorMessage =
                        'Errore durante reccupero dei dati, riprovare.';
                }
                const guardianDataArray: Guardian[] = response.data;
                this.stops = [];

                if (!this.qrData) {
                    this.qrData = {};
                }

                guardianDataArray.forEach((guardianData) => {
                    const formattedTime = guardianData.orario.substring(0, 5);

                    this.stops.push({
                        indirizzo: guardianData.indirizzo,
                        nr_children: guardianData.nr_children,
                        orario: formattedTime,
                        coordinates: guardianData.coordinates,
                    });
                    console.log(this.stops);

                    this.qrData.nome = guardianData.nome;
                    this.qrData.indirizzo = guardianData.indirizzo;
                    this.qrData.order = guardianData.order;
                    this.qrData.orario = guardianData.orario;
                });

                console.log('Stops:', this.stops);

                this.dataTransferService
                    .getFullPath(id)
                    .subscribe((response: any) => {
                        const coordinates = response.data.percorso;
                        this.loaded = true;
                        this.isCoordinatesLoaded = true;
                        console.log(this.loaded);

                        setTimeout(() => {
                            this.leafletMap(coordinates);
                        }, 1000);
                    });

                this.loaded = true;
                this.errorMessage = null;
            },
            error: (error) => {
                this.loaded = true;
                console.error(error);
                this.errorMessage =
                    'Verificare la connessione e riprovare. ' + error;
                this.isAlertOpen = true;
            },
        });
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

        let customPoint = Leaflet.icon({
            iconUrl: '../../assets/location-dot-solid.svg',
        });

        this.stops.forEach((stop) => {
            if (stop.coordinates && stop.coordinates.length === 2) {
                this.isCoordinatesLoaded = true;
                const [latitude, longitude] = stop.coordinates;

                Leaflet.marker([latitude, longitude], {
                    icon: customPoint,
                })
                    .addTo(this.map)
                    .bindPopup(stop.indirizzo);
            } else {
                console.error('Invalid coordinates for stop:', stop);
                this.errorMessage = 'Errore nel caricamento delle fermate.';
                this.isAlertOpen = true;
            }
        });
        const bounds = Leaflet.latLngBounds(
            percorso.map((point) => Leaflet.latLng(point[0], point[1]))
        );
        this.map.fitBounds(bounds);
    }

    ngOnDestroy() {
        this.authSrv.removeId();
        this.authSrv.removeToken();
    }
}
