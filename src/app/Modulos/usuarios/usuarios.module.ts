import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { CrearUsuarioComponent } from './Componentes/crear-usuario/crear-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ABMespecialidadesComponent } from './Componentes/abmespecialidades/abmespecialidades.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    CrearUsuarioComponent,
    ABMespecialidadesComponent,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
