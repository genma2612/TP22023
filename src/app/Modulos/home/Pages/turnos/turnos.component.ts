import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {
  turnos:any;

  constructor(private auth:UserAuthService){
    this.auth.traerColeccionOrdenada('turnos', 'fecha').subscribe(
      response => this.turnos = response
    )
  }

}
