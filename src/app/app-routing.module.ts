import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './Pages/bienvenida/bienvenida.component';
import { RegistrarComponent } from './Componentes/registrar/registrar.component';
import { estaLogueadoGuard } from './Guards/esta-logueado.guard';

const routes: Routes = [
  { path:"welcome", component:BienvenidaComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'registro/:tipo', component:RegistrarComponent},
  { path: 'home', loadChildren: () => import('./Modulos/home/home.module').then(m => m.HomeModule), canActivate:[estaLogueadoGuard] },
  { path: "**", redirectTo: '/welcome' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
