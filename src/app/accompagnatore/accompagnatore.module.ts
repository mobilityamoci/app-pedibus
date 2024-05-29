import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { IonicModule } from '@ionic/angular';

import { AccompagnatorePageRoutingModule } from './accompagnatore-routing.module';

import { AccompagnatorePage } from './accompagnatore.page';

@NgModule({
  imports: [
    ZXingScannerModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AccompagnatorePageRoutingModule
  ],
  declarations: [AccompagnatorePage]
})
export class AccompagnatorePageModule {}
