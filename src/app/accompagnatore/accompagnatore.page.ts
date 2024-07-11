import { Component, ViewChild } from '@angular/core';
import {
    Camera,
    CameraResultType,
    CameraSource,
    Photo,
} from '@capacitor/camera';
import { DataTransferService } from '../services/data-transfer.service';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { AuthService } from '../services/authService';
import { QrFromDeviceService } from '../services/qrFromDevice.service';
@Component({
    selector: 'app-accompagnatore',
    templateUrl: './accompagnatore.page.html',
    styleUrls: ['./accompagnatore.page.scss'],
})
export class AccompagnatorePage {
    qrData?: string;
    data: any = {};
    isButtonDisabled: boolean = true;
    isScanActive: boolean = false;
    isScanBtnActive: boolean = false;

    public isAlertOpen = false;
    errorMessage: string | null = null;
    isProcessing: boolean = false;

    availableDevices!: MediaDeviceInfo[];
    selectedDevice!: MediaDeviceInfo;

    public isLoading: boolean = false;
    constructor(
        private dataTransferService: DataTransferService,
        private router: Router,
        private authServ: AuthService,
        private qrFromDeviceSrv: QrFromDeviceService
    ) {}
    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

    stopScan() {
        this.scanner.scanStop();
    }

    onClick() {
        this.isScanActive = !this.isScanActive;
        this.isScanBtnActive = true;
        setTimeout(() => {
            this.isScanBtnActive = false;
        }, 3500);

        console.log(this.isScanBtnActive);
    }

    checkScan(){
        if (this.isScanActive){
            this.scanner.scanStop()
        }
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
        this.isLoading = false;
    }

    async chooseAndScan() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            this.isLoading = true;
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
                        .authenticate(qrIDRetry, 'guardian')
                        .subscribe({
                            next: (response) => {
                                this.authServ.setToken(response.data.token);
                                this.isLoading = false;
                                this.router.navigate(['/fermate']);
                            },
                            error: (error) => {
                                console.error('Error fetching data', error);
                                this.presentCustomAlert(
                                    'QR code sbagliato, verificare il QR code e riprovare'
                                );
                            },
                        });
                } else {
                    this.presentCustomAlert(
                        "QR code non valido o non trovato nell'immagine selezionata"
                    );
                }
            }
        } catch (e) {
            console.error('Error taking photo', e);
            this.presentCustomAlert('Immagine non selezionata');
        } finally {
            this.isProcessing = false;
        }
    }

    onCodeResult(resultString: string) {
        this.scanner.scanStop();
        this.isLoading = true;
        this.authServ.setId(resultString);
        this.dataTransferService
            .authenticate(resultString, 'guardian')
            .subscribe({
                next: (response) => {
                    this.authServ.setToken(response.data.token);
                    console.log(response.data.token);
                    this.isLoading = false;
                    this.router.navigate(['/fermate']);
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
