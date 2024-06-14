import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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
export class GenitorePage {
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

    onClick() {
        this.scanner.scanStart();
    }
    // ngAfterViewInit{

    // }
    onCodeResult(resultString: string) {
        this.scanner.scanStop()
        this.dataTransferService.authenticate(resultString, 'parent').subscribe(
            (response) => {
                // this.scanner.scanStop();
                this.authServ.setToken(response.data.token)
                this.router.navigate(['/bambino']);
            },
            (error) => {
                console.error('Error fetching student data', error);
            }
        );
    }
}

