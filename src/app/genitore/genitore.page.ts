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
    errorMessage: string | null = null;

    constructor(
        private router: Router,
        private dataTransferService: DataTransferService,
        private authServ: AuthService,
    ) {}

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

    presentCustomAlert(errorMessage: string) {
        this.errorMessage = errorMessage;
        this.isAlertOpen = true;
    }

    onModalDismiss() {
        this.isAlertOpen = false;
    }

    dismissAlert() {
        this.isAlertOpen = false;
        this.scanner.scanStart();
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
                    console.error('Error fetching data', error);
                    this.scanner.scanStop();
                    this.presentCustomAlert(
                        'QR code sbagliato, verificare il QR code e riprovare'
                    );
                },
            });
    }

    ngOnDestroy() {
        this.scanner.scanStop();
    }
}
