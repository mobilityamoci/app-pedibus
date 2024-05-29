import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from "@ionic/angular";
@Component({
  selector: 'app-genitore',
  templateUrl: './genitore.page.html',
  styleUrls: ['./genitore.page.scss'],
})
export class GenitorePage implements OnInit {
  // errorMessage?: string;
  // isSupported: boolean = false
  // barcodes: Barcode[] = []
  qrResultString?: string;
  
  constructor(private alertController: AlertController, private router: Router) { }
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.router.navigate(['/bambino', {data: this.qrResultString}])
  }


  ngOnInit() {
    this
    // BarcodeScanner.isSupported().then((result) => {
    //   this.isSupported = result.supported
    // })
  }

  // async startScan(): Promise<void> {
  //   const granted = await this.requestPermissions();
  //   if (!granted) {
  //     this.presentAlert();
  //     return;
  //   }
  //   const { barcodes } = await BarcodeScanner.scan();
  //   this.barcodes.push(...barcodes);
  // }

  // async requestPermissions(): Promise<boolean> {
  //   const { camera } = await BarcodeScanner.requestPermissions();
  //   return camera === 'granted' || camera === 'limited';
  // }

  // async presentAlert(): Promise<void> {
  //   const alert = await this.alertController.create({
  //     header: 'Permission denied',
  //     message: 'Please grant camera permission to use the barcode scanner.',
  //     buttons: ['OK'],
  //   });
  //   await alert.present();
  // }
}