import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../data-transfer.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-accompagnatore',
    templateUrl: './accompagnatore.page.html',
    styleUrls: ['./accompagnatore.page.scss'],
})
export class AccompagnatorePage implements OnInit {
    qrData?: string;
    data: any = {};
    constructor(
        private dataTransferService: DataTransferService,
        private router: Router
    ) {}

    onCodeResult(resultString: string) {
        this.qrData = resultString;
        const id = this.qrData;

        this.dataTransferService.getFermata(id).subscribe(
            (data) => {
                this.dataTransferService.setData(data);
                this.router.navigate(['/fermate']);
            },
            (error) => {
                console.error('Error fetching student data', error);
            }
        );
        // this.scanner.scanStop()
    }

    ngOnInit() {
        this;
    }
}
