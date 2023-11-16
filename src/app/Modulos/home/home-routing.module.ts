import { UsuariosModule } from './../usuarios/usuarios.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MiPerfilComponent } from './Pages/mi-perfil/mi-perfil.component';
import { esAdminGuard } from 'src/app/Guards/es-admin.guard';
import { SolicitarTurnoComponent } from './Pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './Pages/turnos/turnos.component';
import { MisturnosComponent } from './Pages/misturnos/misturnos.component';
import { PacientesComponent } from './Componentes/Pages/pacientes/pacientes.component';
import { EncuestasComponent } from '../usuarios/Componentes/encuestas/encuestas.component';
import { EstadisticasComponent } from './Pages/estadisticas/estadisticas.component';
import { LogComponent } from './Componentes/log/log.component';

const routes: Routes = [{ path: '', component: HomeComponent,
children: [
  { path: 'usuarios', loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule), canActivate:[esAdminGuard],data: {animation: 'usuarios'} },
  { path: 'turnos', component:TurnosComponent, canActivate:[esAdminGuard],data: {animation: 'turnos'}},
  { path: 'estadisticas', component:EstadisticasComponent, canActivate:[esAdminGuard],data: {animation: 'estadisticas'}},
  { path: 'logs', component:LogComponent, canActivate:[esAdminGuard],data: {animation: 'logs'}},
  { path: 'encuestas', component:EncuestasComponent,data: {animation: 'encuestas'}},
  { path: 'perfil', component: MiPerfilComponent,data: {animation: 'perfil'}},
  { path: 'misturnos', component: MisturnosComponent,data: {animation: 'misturnos'}},
  { path: 'pacientes', component:PacientesComponent,data: {animation: 'pacientes'}},
  { path: 'solicitarTurno', component:SolicitarTurnoComponent,data: {animation: 'solicitarTurno'}},
], data: {animation: 'home'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
