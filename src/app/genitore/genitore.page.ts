import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DataTransferService } from '../data-transfer.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { AuthService } from '../authService';
@Component({
    selector: 'app-genitore',
    templateUrl: './genitore.page.html',
    styleUrls: ['./genitore.page.scss'],
})
export class GenitorePage implements OnInit, OnDestroy {
    qrResultString?: string;
    isButtonDisabled: boolean = true;
    public isAlertOpen = false;
    public alertButtons: any[];
    errorMessage: string | null = null;

    constructor(
        private router: Router,
        private dataTransferService: DataTransferService,
        private authServ: AuthService,
        private navControl: NavController
    ) {
        this.alertButtons = [
            {
                text: 'Riprova',
                handler: () => {
                    this.scanner.scanStart()
                },
            },
        ];
    }

    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;
    ionViewDidEnter() {
        this.scanner.scanStart();
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isButtonDisabled = false;
        }, 4000);
    }
    stopScan() {
        this.scanner.scanStop();
    }

    onClick() {
        this.scanner.scanStart();
    }

    onCodeResult(resultString: string) {
        this.scanner.scanStop();
        this.dataTransferService
            .authenticate(resultString, 'parent')
            .subscribe({
                next: (response) => {
                    this.authServ.setToken(response.data.token);
                    this.router.navigate(['/bambino']);
                },
                error: (error) => {
                    console.error('Error fetching student data', error);
                    this.errorMessage = 'QR code sbagliato'
                    this.isAlertOpen = true
                },
            });
    }

    ngOnDestroy() {
        this.scanner.scanStop();
    }
}
