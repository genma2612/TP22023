import { Component, OnInit, NgModule } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, take } from 'rxjs';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import moment from 'moment';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-turnos-finalizados',
  templateUrl: './turnos-finalizados.component.html',
  styleUrls: ['./turnos-finalizados.component.css']
})
export class TurnosFinalizadosComponent {
  arrayDoctoresYTurnos: any;
  loaded = false;

  chart: any;

  chartOptions = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Turnos finalizados por especialista',
    },
    axisX: {
      title: 'Fechas',
      valueFormatString: 'D/MM',
    },
    axisY: {
      title: 'Cant. turnos',
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      itemclick: function (e: any) {
        if (
          typeof e.dataSeries.visible === 'undefined' ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      },
    },
    data: [],
  };

  constructor(private auth: UserAuthService) {}

  ngOnInit() {
    this.auth
      .traerTodosLosTurnosConDiagnostico().pipe(take(1))
      .subscribe((response) => {
        this.arrayDoctoresYTurnos = Object.values(this.groupByType(response)); // Object.values convierte el objeto a array
        this.generarGrafico(new Date("2023-01-01"), new Date("2030-01-01"));
      });
  }

  groupByType(array: any) {
    // Agrupa turnos por doctores
    return array.reduce((r: any, a: any) => {
      r[a.especialista.uid] = r[a.especialista.uid] || [];
      r[a.especialista.uid].push(a);
      return r;
    }, Object.create(null));
  }

  filtrarPorFecha() {
    const fechaInicio = new Date((<HTMLInputElement>document.getElementById('fechaInicioFinalizados')).value);
    const fechaFinal = new Date((<HTMLInputElement>document.getElementById('fechaFinalFinalizados')).value);
    const fechaInicioMoment = moment(fechaInicio).hours(8).minutes(0).add(1, 'd');
    const fechaFinalMoment = moment(fechaFinal).hours(19).minutes(0).add(1, 'd');

    this.generarGrafico(fechaInicioMoment.toDate(), fechaFinalMoment.toDate());
    this.chart.render();
  }

  generarGrafico(fechaInicio:Date, fechaFinal:Date){
    this.chartOptions.data = [];
    let arrayTest: any = [];
    let objTest: any;
    let arrayTest2: any = [];
    let arrayGenerador = this.arrayDoctoresYTurnos;
    arrayGenerador.forEach((element: any) => {
      objTest = { name: '', dataPoints: [] };
      objTest.name =
      element[0].especialista.nombre +
      ' ' +
      element[0].especialista.apellido;
      element.forEach((item: any) => {
        if(item.fecha.toDate() >= fechaInicio && item.fecha.toDate() <= fechaFinal){
          var date = item.fecha.toDate();
          objTest.dataPoints.push([(moment(date)).format('DD-MMM-YYYY')]);
        }
      });
      //Agrupa las fechas de dia y horario duplicados
      objTest.dataPoints = Object.values(
        objTest.dataPoints.reduce((acc: any, current: any) => {
          acc[current] = acc[current] ?? [];
          acc[current].push(current);
          return acc;
        }, {})
      );
      // Elimino los elementos agrupados para que quede una fecha con la cant de turnos de dicha fecha.
      objTest.dataPoints.forEach((element: any) => {
        element[0].push(element.length); //
        //console.info(moment(element[0][0]).utc().toDate());
        if (element.length > 1) {
          element.length = 1;
        }
      });
      let obj2:any = {
        type: "splineArea",
        showInLegend: true,
        name: objTest.name,
        xValueFormatString: "DD/MM",
        dataPoints: []
        };
      objTest.dataPoints.forEach((element:any) => {
        let dataP = {x: new Date(element[0][0]), y:element[0][1]};
        obj2.dataPoints.push(dataP);
      });
      arrayTest2.push(obj2);
      arrayTest.push(objTest);
    });
    this.chartOptions.data = arrayTest2;
    this.loaded = true;
    //console.info(this.chartOptions);
    //console.info(arrayTest);
    //console.info(arrayTest2);
  }


  getChartInstance(chart: object) {
		this.chart = chart;
	}

}
