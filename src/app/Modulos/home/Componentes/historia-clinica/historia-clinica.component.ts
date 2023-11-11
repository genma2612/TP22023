import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Turno } from 'src/app/Clases/interfaces';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit, OnDestroy, OnChanges {
  @Input() usuario:any;
  turnosConDiagnostico:any[] = [];

  $obsTurnos:Subscription = new Subscription();
  medicosQueMeAtendieron:any[] = [];
  filtroDoctor: any = '';
  constructor(private auth: UserAuthService, private spinner: NgxSpinnerService){

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.medicosQueMeAtendieron = [];
    this.cargarHC();
    //console.info(changes['usuario'].currentValue);
    //console.info(changes['usuario'].previousValue);
  }
  
  
  ngOnInit(): void {
    this.cargarHC();
    }

    cargarHC(){
      this.spinner.show();
      this.$obsTurnos =  this.auth.traerColeccionTurnosConDiagnostico(this.usuario.uid).subscribe(
        response => {
          this.turnosConDiagnostico = response
          this.turnosConDiagnostico.forEach(item =>{
            this.medicosQueMeAtendieron.push(item.especialista);
          });
          this.medicosQueMeAtendieron = this.filtrarArrayPacientes(this.medicosQueMeAtendieron);
          this.spinner.hide();
        } 
      )
    }

    filtrarArrayPacientes(arr: any[]){
      return [...new Map(arr.map(v => [v.uid, v])).values()]; //Elimina duplicados
    }
    
    ngOnDestroy(): void {
      this.$obsTurnos.unsubscribe();
    }


      

}
