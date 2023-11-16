import { Component, OnInit, NgModule } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, take } from 'rxjs';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-turnos-por-especialidad',
  templateUrl: './turnos-por-especialidad.component.html',
  styleUrls: ['./turnos-por-especialidad.component.css'],
})
export class TurnosPorEspecialidadComponent {
  data$!: Observable<any>;
  especialidades$!: any;
  arrayEspecialidades: any;
  objData: any = [];

  options: any = {
    accessibility:{
      enabled:false
    },
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Turnos por especialidad',
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            borderWidth: 2,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br>Cant: {point.y}<br>{point.percentage:.2f}%',
                distance: 20
            }
        }
    },
    series: [
      {
        name: 'Turnos',
        colorByPoint: true,
        data: [],
      },
    ],
  };

  chart!: Chart;

  constructor(
    private auth: UserAuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.especialidades$ = this.auth
      .traerColeccionOrdenada('especialidades', 'nombre').pipe(take(1))
      .subscribe((response) => {
        this.arrayEspecialidades = response;
        this.auth
          .traerColeccionOrdenada('turnos', 'fecha').pipe(take(1))
          .subscribe((turnos) => {
            this.arrayEspecialidades.forEach((element: any) => {
              let item = { name: element.nombre, y: 0 };
              item.y = turnos.filter((turno: any) => turno.especialidadElegida === item.name).length;
              if(item.y > 0)
                this.options.series[0].data.push(item);
            });
            this.chart = new Chart(this.options);
          });
      });
  }
}
