import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {



  constructor(private userAuth:UserAuthService, private ruteador:Router) {
  }


  esAdmin(){
    if(this.userAuth.hayUsuarioLogueado)
      return this.userAuth.usuarioLogueado.rol == 'administrador';
    else 
      return false;
  }

  salir(){
    this.userAuth.salir().then(()=>
      this.ruteador.navigate(['/welcome'])
    );
  }

}
