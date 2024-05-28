import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { GenitorePageRoutingModule } from './genitore-routing.module';

import { GenitorePage } from './genitore.page';

@NgModule({
  imports: [
    ZXingScannerModule,
    CommonModule,
    FormsModule,
    IonicModule,
    GenitorePageRoutingModule
  ],
  declarations: [GenitorePage]
})
export class GenitorePageModule {}
