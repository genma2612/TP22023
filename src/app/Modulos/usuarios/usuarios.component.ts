import { Component, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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
  hc:any;
  pacienteSeleccionado:any;




  constructor(private auth: UserAuthService, private spinner:NgxSpinnerService){
    this.auth.traerColeccionOrdenada("usuarios", 'rol').subscribe(
      response => this.coleccionUsuarios = response
    )
  }

  cambiarTipo(tipo:string){
    this.tipoUsuario = tipo;
  }

  cambiarAcceso(item:Especialista){
    this.auth.updateDocument('usuarios', item.uid, !item.tieneAcceso);
  }

  verHC(paciente:any){
      this.spinner.show();
      this.pacienteSeleccionado = paciente;
      this.auth.traerColeccionTurnosConDiagnostico(paciente.uid).subscribe(
        response => {
          this.hc = response;
          document.getElementById('btnModalHC')?.click();
          this.spinner.hide();
        } 
      )
  }


  cerrarModal(){
    document.getElementById('closeModalBtn')?.click();
  }
}
