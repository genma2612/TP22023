import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {



  constructor(private userAuth:UserAuthService) {
  }


  esAdmin(){
    if(this.userAuth.hayUsuarioLogueado)
      return this.userAuth.usuarioLogueado.rol == 'administrador';
    else 
      return false;
  }

}
