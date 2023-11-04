import { UsuariosModule } from './../usuarios/usuarios.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MiPerfilComponent } from './Pages/mi-perfil/mi-perfil.component';
import { esAdminGuard } from 'src/app/Guards/es-admin.guard';
import { SolicitarTurnoComponent } from './Pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './Pages/turnos/turnos.component';
import { MisturnosComponent } from './Pages/misturnos/misturnos.component';

const routes: Routes = [{ path: '', component: HomeComponent,
children: [
  { path: 'usuarios', loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule), canActivate:[esAdminGuard] },
  { path: 'turnos', component:TurnosComponent, canActivate:[esAdminGuard]},
  { path: 'perfil', component: MiPerfilComponent},
  { path: 'misturnos', component: MisturnosComponent},
  { path: 'solicitarTurno', component:SolicitarTurnoComponent}
] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
