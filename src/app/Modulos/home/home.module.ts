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
import { TurnosComponent } from './Pages/turnos/turnos.component';
import { MisturnosComponent } from './Pages/misturnos/misturnos.component';
import { DirectivaBotonEspecialidadDirective } from './Directivas/directiva-boton-especialidad.directive';
import { CargarHistoriaClinicaComponent } from './Componentes/cargar-historia-clinica/cargar-historia-clinica.component';
import { EncuestaComponent } from './Componentes/encuesta/encuesta.component';
import { HistoriaClinicaComponent } from './Componentes/historia-clinica/historia-clinica.component';
import { PacientesComponent } from './Componentes/Pages/pacientes/pacientes.component';
import {MatButtonModule} from '@angular/material/button'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { TableModule } from 'ngx-easy-table';
import { EstadisticasComponent } from './Pages/estadisticas/estadisticas.component';
import {MatTabsModule} from '@angular/material/tabs';
import { TurnosPorEspecialidadComponent } from './Componentes/graficos/turnos-por-especialidad/turnos-por-especialidad.component';
import { TurnosSolicitadosComponent } from './Componentes/graficos/turnos-solicitados/turnos-solicitados.component';
import { TurnosFinalizadosComponent } from './Componentes/graficos/turnos-finalizados/turnos-finalizados.component';
import { TurnosPorDiaComponent } from './Componentes/graficos/turnos-por-dia/turnos-por-dia.component';
import { ChartModule } from 'angular-highcharts';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { LogComponent } from './Componentes/log/log.component';


@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    MiPerfilComponent,
    DisponibilidadComponent,
    DetallePerfilComponent,
    SolicitarTurnoComponent,
    FiltroPipe,
    TurnosComponent,
    MisturnosComponent,
    DirectivaBotonEspecialidadDirective,
    CargarHistoriaClinicaComponent,
    EncuestaComponent,
    HistoriaClinicaComponent,
    PacientesComponent,
    EstadisticasComponent,
    TurnosPorEspecialidadComponent,
    TurnosSolicitadosComponent,
    TurnosFinalizadosComponent,
    TurnosPorDiaComponent,
    LogComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    TableModule,
    MatGridListModule,
    MatTabsModule,
    ChartModule,
    CanvasJSAngularChartsModule
  ],
  exports: [
    HistoriaClinicaComponent
  ]
})
export class HomeModule { }
