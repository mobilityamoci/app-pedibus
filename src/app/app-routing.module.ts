import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadChildren: () =>
            import('./page/tab1.module').then((m) => m.Tab1PageModule),
    },
    {
        path: 'genitore',
        loadChildren: () =>
            import('./genitore/genitore.module').then(
                (m) => m.GenitorePageModule
            ),
    },
    {
        path: 'accompagnatore',
        loadChildren: () =>
            import('./accompagnatore/accompagnatore.module').then(
                (m) => m.AccompagnatorePageModule
            ),
    },
    {
        path: 'bambino',
        loadChildren: () =>
            import('./bambino/bambino.module').then((m) => m.BambinoPageModule),
    },
    {
        path: 'fermate',
        loadChildren: () =>
            import('./fermate/fermate.module').then((m) => m.FermatePageModule),
    },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
