import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FermatePage } from './fermate.page';

const routes: Routes = [
  {
    path: '',
    component: FermatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FermatePageRoutingModule {}
