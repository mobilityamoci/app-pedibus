import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FermatePageRoutingModule } from './fermate-routing.module';

import { FermatePage } from './fermate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FermatePageRoutingModule
  ],
  declarations: [FermatePage]
})
export class FermatePageModule {}
