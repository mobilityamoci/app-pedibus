import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../data-transfer.service';
import * as Leaflet from 'leaflet';
import { Guardian } from '../interfaces/Guardian';
import { AuthService } from '../authService';
import { Router } from '@angular/router';
@Component({
    selector: 'app-fermate',
    templateUrl: './fermate.page.html',
    styleUrls: ['./fermate.page.scss'],
})
export class FermatePage implements OnInit {
    qrData: any;
    stops: { orario: string; indirizzo: string; nr_children: string }[] = [];
    studenti!: any[];
    public loaded: boolean = false;
    public isCoordinatesLoaded: boolean = false;
    errorMessage: string | null = null;
    private map!: Leaflet.Map;
    constructor(
        private router: Router,
        private dataTransferService: DataTransferService,
        private authSrv: AuthService
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

    loadGuardian() {
        const id = this.authSrv.getId();

        if (!id) {
            this.loaded = true;
            console.error(
                'ID non presente, si prega di scansionare il codice QR di nuovo'
            );
            this.errorMessage =
                'ID non presente, si prega di scansionare il codice QR di nuovo';
            return;
        }

        console.log(id + '<<<<<<<<<<<id');

        this.dataTransferService.getFermata(id).subscribe({
            next: (response) => {
                if (response.error) {
                    this.loaded = true;
                    this.errorMessage =
                        'Errore durante reccupero dei dati, riprovare.';
                }
                const guardianDataArray: Guardian[] = response.data;

                console.log(guardianDataArray, '<<<<<<<<<<<<<DATA>>>>>>>>>>>>');

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
                    });

                    this.qrData.nome = guardianData.nome;
                    this.qrData.indirizzo = guardianData.indirizzo;
                    this.qrData.order = guardianData.order;
                    this.qrData.orario = guardianData.orario;
                });

                console.log('Stops:', this.stops);
                console.log('Updated QR Data:', this.qrData);

                this.dataTransferService
                    .getFullPath(id)
                    .subscribe((response: any) => {
                        const coordinates = response.data.percorso;
                        console.log(coordinates);
                        this.loaded = true;
                        this.isCoordinatesLoaded = true
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
                console.error(error, 'Tempo per richiesta finito', error.message);
                this.errorMessage =
                    'Errore durante reccupero dei dati, verificare la connessione ad internet e riprovare.';
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
    const bounds = Leaflet.latLngBounds(
        percorso.map((point) => Leaflet.latLng(point[0], point[1]))
    );
    this.map.fitBounds(bounds);
    }
}
