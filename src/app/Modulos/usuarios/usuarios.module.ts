import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { CrearUsuarioComponent } from './Componentes/crear-usuario/crear-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ABMespecialidadesComponent } from './Componentes/abmespecialidades/abmespecialidades.component';
import { EncuestasComponent } from './Componentes/encuestas/encuestas.component';
import { TableModule } from 'ngx-easy-table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card'; 
import { MatGridListModule } from '@angular/material/grid-list';
import { HomeModule } from '../home/home.module';
import { TurnosPacienteComponent } from './Componentes/turnos-paciente/turnos-paciente.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    CrearUsuarioComponent,
    ABMespecialidadesComponent,
    EncuestasComponent,
    TurnosPacienteComponent,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    HomeModule
  ]
})
export class UsuariosModule { }
