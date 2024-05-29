import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BambinoPageRoutingModule } from './bambino-routing.module';

import { BambinoPage } from './bambino.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BambinoPageRoutingModule
  ],
  declarations: [BambinoPage]
})
export class BambinoPageModule {}
