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
export class AccompagnatorePage implements OnDestroy {
stopScan() {
    this.scanner.scanStop()
}
    qrData?: string;
    data: any = {};
    constructor(
        private dataTransferService: DataTransferService,
        private router: Router,
        private authServ: AuthService, private authSrv: AuthService
    ) {}
    @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

    ionViewDidEnter() {
        this.scanner.scanStart();
    }
    onCodeResult(resultString: string) {
        this.scanner.scanStop();
        this.authServ.setId(resultString)
        this.dataTransferService
            .authenticate(resultString, 'guardian')
            .subscribe(
                (response) => {
                    this.authServ.setToken(response.data.token);
                    console.log(response.data.token);
                    
                    this.router.navigate(['/fermate']);
                },
                (error) => {
                    console.error('Error fetching data', error);
                }
            );
    }

    ngOnDestroy() {
        this.scanner.scanStop();
    }
}
