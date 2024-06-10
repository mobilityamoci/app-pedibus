import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataTransferService } from '../data-transfer.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
@Component({
    selector: 'app-genitore',
    templateUrl: './genitore.page.html',
    styleUrls: ['./genitore.page.scss'],
})
export class GenitorePage implements OnInit{
    qrResultString?: string;
    data: any = {};

    constructor(
        private router: Router,
        private dataTransferService: DataTransferService
    ) {}
    ngOnInit(): void {
        this.scanner.scanStart()
    }
    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

    onCodeResult(resultString: string) {
        this.qrResultString = resultString;
        const id = this.qrResultString;

        this.dataTransferService.getStudente(id).subscribe(
            (data) => {
                this.dataTransferService.setData(data);
                this.router.navigate(['/bambino']);
            },
            (error) => {
                console.error('Error fetching student data', error);
            }
        );
        this.scanner.scanStop()
    }
}
