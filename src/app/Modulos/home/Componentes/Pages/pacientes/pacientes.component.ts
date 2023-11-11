import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnChanges {

  usuarioActual;
  pacientes:any[] = [];
  turnos:any;
  hc:any;
  pacienteSeleccionado:any = null;


  constructor(private auth:UserAuthService, private spinner:NgxSpinnerService){
    this.usuarioActual = this.auth.getUsuarioLocalstorage();
    this.spinner.show();
    this.auth.traerColeccionTurnosConDiagnostico(this.usuarioActual.uid).subscribe(
      response => {
        this.turnos = response;
        this.spinner.hide();
        this.turnos.forEach((turno:any) =>{
          this.pacientes.push(turno.paciente)
        })
        this.pacientes = this.filtrarArrayPacientes(this.pacientes);
      }  
    )

  }
  
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  filtrarArrayPacientes(arr: any[]){

    return [...new Map(arr.map(v => [v.uid, v])).values()]; //Elimina duplicados

  }


/*
  filtrarArrayPacientes(arr: any[]) {
    let m: any = {}
    let newarr = []
    for (let i = 0; i < arr.length; i++) {
      let v = arr[i];
      if (!m[v]) {
        newarr.push(v);
        m[v] = true;
      }
    }
    return newarr;
  }
  */

  verHC(paciente:any){
    //this.spinner.show();
    this.pacienteSeleccionado = paciente;
    document.getElementById('btnModalHC')?.click();
    /*
    this.auth.traerColeccionTurnosConDiagnostico(paciente.uid).subscribe(
      response => {
        this.hc = response;
        this.spinner.hide();
      } 
    )*/

  }

}
