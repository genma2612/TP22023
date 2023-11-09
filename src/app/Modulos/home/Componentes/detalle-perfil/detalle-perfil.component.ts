import { Component, Input } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-detalle-perfil',
  templateUrl: './detalle-perfil.component.html',
  styleUrls: ['./detalle-perfil.component.css']
})
export class DetallePerfilComponent {
  @Input() perfil:any;
  //perfil:any;

  constructor(private userAuth: UserAuthService){
    //this.perfil = JSON.parse(localStorage.getItem('usuarioActual')!);
  }

}
