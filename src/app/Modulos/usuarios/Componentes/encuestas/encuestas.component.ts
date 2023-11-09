import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css']
})
export class EncuestasComponent {
  encuestas:any[] = [];

  codigosRango = ['No!', 'Si no me queda otra', 'No lo sé', 'Probablemente', 'Definitivamente!'];


  constructor(private auth:UserAuthService){
    this.auth.traerColeccionOrdenada('encuestas', 'fecha').subscribe(
      data => this.encuestas = data
    )
}

}
