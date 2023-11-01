import { UsuariosModule } from './../usuarios/usuarios.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MiPerfilComponent } from './Pages/mi-perfil/mi-perfil.component';
import { esAdminGuard } from 'src/app/Guards/es-admin.guard';

const routes: Routes = [{ path: '', component: HomeComponent,
children: [
  { path: 'usuarios', loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule), canActivate:[esAdminGuard] },
  { path: 'perfil', component: MiPerfilComponent}
] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
