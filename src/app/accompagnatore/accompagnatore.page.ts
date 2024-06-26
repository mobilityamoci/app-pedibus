import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTransferService } from '../data-transfer.service';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { AuthService } from '../authService';
import { NavController } from '@ionic/angular';
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
    public alertButtons: any[];
    errorMessage: string | null = null;


    constructor(
        private dataTransferService: DataTransferService,
        private router: Router,
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
        ];}
    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

    ngOnInit(): void {
        setTimeout(() => {
            this.isButtonDisabled = false;
        }, 4000);
    }

    ionViewDidEnter() {
        this.scanner.scanStart();
    }

    stopScan() {
        this.scanner.scanStop();
    }

    onCodeResult(resultString: string) {
        this.scanner.scanStop();
        this.authServ.setId(resultString);
        this.dataTransferService
            .authenticate(resultString, 'guardian')
            .subscribe({
                next: (response) => {
                    this.authServ.setToken(response.data.token);
                    console.log(response.data.token);

                    this.router.navigate(['/fermate']);
                },
                error: (error) => {
                    console.error('Error fetching data', error);
                    this.errorMessage = 'QR code sbagliato'
                    this.isAlertOpen = true
                },
            });
    }

    ngOnDestroy() {
        this.scanner.scanStop();
    }
}
