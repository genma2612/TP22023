import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SidebarComponent } from './Componentes/sidebar/sidebar.component';
import { MiPerfilComponent } from './Pages/mi-perfil/mi-perfil.component';
import { DisponibilidadComponent } from './Componentes/disponibilidad/disponibilidad.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetallePerfilComponent } from './Componentes/detalle-perfil/detalle-perfil.component';
import { SolicitarTurnoComponent } from './Pages/solicitar-turno/solicitar-turno.component';
import { FiltroPipe } from 'src/app/Pipes/filtro.pipe';


@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    MiPerfilComponent,
    DisponibilidadComponent,
    DetallePerfilComponent,
    SolicitarTurnoComponent,
    FiltroPipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
