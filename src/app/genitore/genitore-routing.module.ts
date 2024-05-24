import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenitorePage } from './genitore.page';

const routes: Routes = [
  {
    path: '',
    component: GenitorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenitorePageRoutingModule {}
