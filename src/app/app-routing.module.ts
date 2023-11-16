import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './Pages/bienvenida/bienvenida.component';
import { RegistrarComponent } from './Componentes/registrar/registrar.component';
import { estaLogueadoGuard } from './Guards/esta-logueado.guard';
import { LobbyComponent } from './Pages/lobby/lobby.component';

const routes: Routes = [
  { path:"lobby", component:LobbyComponent, data: { animation: 'lobby' }},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'welcome', component:BienvenidaComponent, data: {animation: 'welcome'}},
  { path: 'registro/:tipo', component:RegistrarComponent},
  { path: 'home', loadChildren: () => import('./Modulos/home/home.module').then(m => m.HomeModule), canActivate:[estaLogueadoGuard], data: {animation: 'home'} },
  { path: "**", redirectTo: '/home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
