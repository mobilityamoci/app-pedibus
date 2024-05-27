import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccompagnatorePageRoutingModule } from './accompagnatore-routing.module';

import { AccompagnatorePage } from './accompagnatore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccompagnatorePageRoutingModule
  ],
  declarations: [AccompagnatorePage]
})
export class AccompagnatorePageModule {}
