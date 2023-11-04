import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';


@Component({
  selector: 'app-misturnos',
  templateUrl: './misturnos.component.html',
  styleUrls: ['./misturnos.component.css']
})
export class MisturnosComponent {
  turnos:any;
  usuarioActual:any
  constructor(private auth:UserAuthService){
    this.usuarioActual = this.auth.getUsuarioLocalstorage();
    this.auth.traerColeccionOrdenada(`usuarios/${this.usuarioActual.uid}/turnos`, 'fecha').subscribe(
      response => this.turnos = response
    )
  }

}
