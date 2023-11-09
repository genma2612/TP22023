import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Turno } from 'src/app/Clases/interfaces';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit, OnDestroy {
  @Input() usuario:any;
  turnosConDiagnostico:any[] = [];
  $obsTurnos:Subscription = new Subscription(); 
  constructor(private auth: UserAuthService){

  }
  
  
  ngOnInit(): void {
    this.$obsTurnos =  this.auth.traerColeccionTurnosConDiagnostico(this.usuario.uid).subscribe(
        response => {
          this.turnosConDiagnostico = response
        } 
      )
    }
    
    ngOnDestroy(): void {
      this.$obsTurnos.unsubscribe();
    }

}
