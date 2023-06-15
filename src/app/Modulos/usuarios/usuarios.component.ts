import { Component, Output, EventEmitter } from '@angular/core';
import { Especialista } from 'src/app/Clases/interfaces';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  tipoUsuario = 'administrador';
  coleccionUsuarios:any;

  constructor(private userAuth: UserAuthService){
    this.userAuth.traerColeccionOrdenada("usuarios", 'rol').subscribe(
      response => this.coleccionUsuarios = response
    )
  }

  cambiarTipo(tipo:string){
    this.tipoUsuario = tipo;
  }

  cambiarAcceso(item:Especialista){
    this.userAuth.updateDocument('usuarios', item.uid, !item.tieneAcceso);
  }
}
