import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTransferService } from '../data-transfer.service';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { AuthService } from '../authService';
@Component({
    selector: 'app-accompagnatore',
    templateUrl: './accompagnatore.page.html',
    styleUrls: ['./accompagnatore.page.scss'],
})
export class AccompagnatorePage implements OnInit, OnDestroy {
    qrData?: string;
    data: any = {};
    isButtonDisabled: boolean = true;
    public isAlertOpen = false;
    errorMessage: string | null = null;

    public isLoading: boolean = false;
    constructor(
        private dataTransferService: DataTransferService,
        private router: Router,
        private authServ: AuthService
    ) {}
    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

    ngOnInit(): void {
        setTimeout(() => {
            this.isButtonDisabled = false;
        }, 4000);
    }
    stopScan() {
        this.scanner.scanStop();
    }

    ionViewDidEnter() {
        this.scanner.scanStart();
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
        this.scanner.scanStart();
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
