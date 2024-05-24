import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./page/tab1.module').then(m => m.Tab1PageModule)
    },
    {
        path: 'genitore',
        loadChildren: () => import('./genitore/genitore.module').then(m => m.GenitorePageModule)
    },

];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
