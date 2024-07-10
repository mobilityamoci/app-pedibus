import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    Camera,
    CameraResultType,
    CameraSource,
    Photo,
} from '@capacitor/camera';
import { Router } from '@angular/router';
import { DataTransferService } from '../services/data-transfer.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { AuthService } from '../services/authService';
import { QrFromDeviceService } from '../services/qrFromDevice.service';

@Component({
    selector: 'app-genitore',
    templateUrl: './genitore.page.html',
    styleUrls: ['./genitore.page.scss'],
})
export class GenitorePage {
    qrResultString?: string;
    isScanActive: boolean = false;
    isScanBtnActive: boolean = false;

    availableDevices!: MediaDeviceInfo[];
    selectedDevice!: MediaDeviceInfo;

    public isLoading: boolean = false;
    isButtonDisabled: boolean = true;
    public isAlertOpen = false;
    errorMessage: string | null = null;
    isProcessing: boolean = false;

    constructor(
        private router: Router,
        private dataTransferService: DataTransferService,
        private authServ: AuthService,
        private qrFromDeviceSrv: QrFromDeviceService
    ) {}

    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

    scanForDevices() {
        const codeReader = new ZXingScannerComponent();
        codeReader.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
            this.availableDevices = devices;
            if (devices.length > 0) {
                this.selectedDevice = devices[0];
            }
        });
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
    }

    onClick() {
        this.isScanActive = !this.isScanActive;
        this.isScanBtnActive = true;
        setTimeout(() => {
            this.isScanBtnActive = false;
        }, 3500);

        console.log(this.isScanBtnActive);
    }

    async chooseAndScan() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.isLoading = true
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Photos,
            });

            if (image.webPath) {
                console.log('Image path:', image.webPath);

                await new Promise((resolve) => setTimeout(resolve, 5000));

                const qrID = await this.qrFromDeviceSrv.scanImage(
                    image.webPath
                );
                console.log('QR ID:', qrID);

                await new Promise((resolve) => setTimeout(resolve, 5000));
                const qrIDRetry = await this.qrFromDeviceSrv.scanImage(
                    image.webPath
                );
                console.log('QR ID Retry:', qrIDRetry);

                if (qrID) {
                    this.onCodeResult(qrID);
                } else if (qrIDRetry) {
                    console.log('Processing QR ID Retry:', qrIDRetry);
                    this.dataTransferService
                        .authenticate(qrIDRetry, 'parent')
                        .subscribe({
                            next: (response) => {
                                this.authServ.setToken(response.data.token);
                                this.isLoading = false
                                this.router.navigate(['/bambino']);
                            },
                            error: (error) => {
                                console.error('Error fetching data', error);
                                this.isLoading = false
                                this.presentCustomAlert(
                                    'QR code sbagliato, verificare il QR code e riprovare'
                                );
                            },
                        });
                } else {
                    this.isLoading = false
                    this.presentCustomAlert(
                        "QR code non valido o non trovato nell'immagine selezionata"
                    );
                }
            }
        } catch (e) {
            console.error('Error taking photo', e);
            this.isLoading = false

            this.presentCustomAlert('Immagine non selezionata');
        } finally {
            this.isProcessing = false;
        }
    }

    onCodeResult(resultString: string) {
        this.isLoading = true
        if (this.isScanActive) {
            this.scanner.scanStop();
            this.dataTransferService
                .authenticate(resultString, 'parent')
                .subscribe({
                    next: (response) => {
                        this.authServ.setToken(response.data.token);
                        this.isLoading = false

                        this.router.navigate(['/bambino']);
                    },
                    error: (error) => {
                        console.error('Error fetching data', error);
                        this.scanner.scanStop();
                        this.isScanActive = !this.isScanActive;

                        this.presentCustomAlert(
                            'QR code sbagliato, verificare il QR code e riprovare'
                        );
                    },
                });
        }
    }
}
