import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataTransferService } from '../data-transfer.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { AuthService } from '../authService';
@Component({
    selector: 'app-genitore',
    templateUrl: './genitore.page.html',
    styleUrls: ['./genitore.page.scss'],
})
export class GenitorePage implements OnDestroy {
    qrResultString?: string;
    // data: any = {};

    constructor(
        private router: Router,
        private dataTransferService: DataTransferService,
        private authServ: AuthService
    ) {}

    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;
    ionViewDidEnter() {
        this.scanner.scanStart();
    }
    stopScan() {
        this.scanner.scanStop();
    }

    onClick() {
        this.scanner.scanStart();
    }

    onCodeResult(resultString: string) {
        this.scanner.scanStop();
        this.dataTransferService.authenticate(resultString, 'parent').subscribe(
            (response) => {
                // this.scanner.scanStop();
                this.authServ.setToken(response.data.token);
                this.router.navigate(['/bambino']);
            },
            (error) => {
                console.error('Error fetching student data', error);
            }
        );
    }

    ngOnDestroy() {
        this.scanner.scanStop();
    }
}
