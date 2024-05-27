import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccompagnatorePage } from './accompagnatore.page';

const routes: Routes = [
  {
    path: '',
    component: AccompagnatorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccompagnatorePageRoutingModule {}
