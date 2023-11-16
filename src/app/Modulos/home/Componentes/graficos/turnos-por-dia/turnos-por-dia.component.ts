import { Component, OnInit, NgModule } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, take } from 'rxjs';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Chart } from 'angular-highcharts';
import moment from 'moment';

@Component({
  selector: 'app-turnos-por-dia',
  templateUrl: './turnos-por-dia.component.html',
  styleUrls: ['./turnos-por-dia.component.css'],
})
export class TurnosPorDiaComponent {
  data$!: Observable<any>;
  arrayTurnos: any;

  options: any = {
    accessibility:{
      enabled:false
    },
    chart: {
      type: 'column',
    },
    title: {
      text: 'Turnos por día',
      align: 'left',
    },
    subtitle: {
      text:
        '',
      align: 'left',
    },
    xAxis: {
      categories: [],
      crosshair: true,
      accessibility: {
        description: 'Día',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'cant',
      },
    },
    tooltip: {
      valueSuffix: '',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y}'
            }
        }
    },
    series: [],
  };

  chart!: Chart;

  constructor(
    private auth: UserAuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    let fecha:any;
    this.auth.traerColeccionOrdenada('turnos', 'fecha').pipe(take(1))
    .subscribe((turnos) => {
      this.arrayTurnos = turnos;
      let arrayFechas: any = [];
      //console.info(this.arrayTurnos);

      this.arrayTurnos.forEach((element: any) => {
        fecha = moment(element.fecha.toDate());
        arrayFechas.push({
          mes: fecha.utc().month(),
          dia: fecha.utc().date(),
        });
      });

      //console.info(arrayFechas);
      //Agrupo por mismo mes y día
      let groupingViaCommonProperty = Object.values(
        arrayFechas.reduce((acc: any, current: any) => {
          acc[current.dia] = acc[current.dia] ?? [];
          acc[current.dia].push(current);
          return acc;
        }, {})
      );

      //Ordeno por mes luego del agrupamiento
      groupingViaCommonProperty.sort((a:any,b:any) => a[0].mes - b[0].mes); // b - a for reverse sort      
      //console.log(groupingViaCommonProperty);

      let series: any = { name: 'Turnos', data: [] };


      groupingViaCommonProperty.forEach((item: any) => {
        series.data.push(item.length);
        //console.info(moment().month(item[0].mes-1).date(item[0].dia).format('DD-MM'));
        this.options.xAxis.categories.push(moment().month(item[0].mes).date(item[0].dia).format('DD-MM'));
      });

      this.options.series[0] = series;
      //console.info(this.options);
      this.chart = new Chart(this.options);
    });
  }
}
