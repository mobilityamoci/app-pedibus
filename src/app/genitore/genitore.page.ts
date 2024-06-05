import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataTransferService } from '../data-transfer.service';
@Component({
    selector: 'app-genitore',
    templateUrl: './genitore.page.html',
    styleUrls: ['./genitore.page.scss'],
})
export class GenitorePage {
    qrResultString?: string;
    data: any = {};

    constructor(
        private alertController: AlertController,
        private router: Router,
        private http: HttpClient,
        private dataTransferService: DataTransferService
    ) {}

    onCodeResult(resultString: string) {
        this.qrResultString = resultString;
        const id = this.qrResultString;

        this.dataTransferService.getStudente(id).subscribe(
            (data) => {
                this.dataTransferService.setData(data);
                console.log('id ' + id, 'data ' + JSON.stringify(data));

                this.router.navigate(['/bambino']);
            },
            (error) => {
                console.error('Error fetching student data', error);
            }
        );
    }
}
