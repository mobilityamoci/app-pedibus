import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BambinoPage } from './bambino.page';

const routes: Routes = [
  {
    path: '',
    component: BambinoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BambinoPageRoutingModule {}
