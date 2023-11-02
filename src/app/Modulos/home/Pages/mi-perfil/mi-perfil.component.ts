import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {

  perfilActual:any;

  constructor(private userAuth: UserAuthService){
    this.perfilActual = this.userAuth.usuarioLogueado;
    //console.info(this.perfilActual);
  }

}
