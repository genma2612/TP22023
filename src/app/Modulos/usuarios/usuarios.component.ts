import { Component, Output, EventEmitter } from '@angular/core';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { Especialista } from 'src/app/Clases/interfaces';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import * as XLSX from 'xlsx'; //excel

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
exportarTurnosUsuario() {
throw new Error('Method not implemented.');
}
  tipoUsuario = 'administrador';
  coleccionUsuarios: any;
  pacienteSeleccionado: any;
  turnosPaciente$! : Observable<any>;
  fileName = 'usuarios.xlsx';


  constructor(private auth: UserAuthService, private spinner: NgxSpinnerService) {
    this.auth.traerColeccionOrdenada("usuarios", 'rol').subscribe(
      response => this.coleccionUsuarios = response
    )
  }


  cambiarTipo(tipo: string) {
    this.tipoUsuario = tipo;
  }

  cambiarAcceso(item: Especialista) {
    this.auth.updateDocument('usuarios', item.uid, !item.tieneAcceso);
  }

  seleccionarUsuario(paciente: any) {
    this.pacienteSeleccionado = paciente;
  }


  cerrarModal() {
    document.getElementById('closeModalBtn')?.click();
  }

  exportTurnosUsuario() {
    let jsonForExport;
    this.spinner.show();
    this.auth.traerColeccionTurnosCompleta(this.pacienteSeleccionado.uid).subscribe(
      response => {
        jsonForExport = response;
        const rows = jsonForExport.map((item:any) => ({
          Paciente: this.pacienteSeleccionado.nombre + ' ' + this.pacienteSeleccionado.apellido,
          Especialista: item.especialista.nombre + ' ' + item.especialista.apellido,
          Especialidad: item.especialidadElegida,
          Fecha: item.fecha.toDate().toLocaleString(),
          Duracion: item.duracion,
          Estado: item.estado,
          Comentario: item.comentario
    
        }));
        rows.sort((l:any,r:any) => l.Fecha.localeCompare(r.Fecha))
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows, {cellDates: true});
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Turnos ' + this.pacienteSeleccionado.nombre + ' ' + this.pacienteSeleccionado.apellido);
        XLSX.writeFile(wb, 'Turnos ' + this.pacienteSeleccionado.nombre + ' ' + this.pacienteSeleccionado.apellido + '.xlsx');
        this.spinner.hide();
      }
    )
  }

  exportUsuarios() {
    let jsonForExport = this.coleccionUsuarios;
    const rows = jsonForExport.map((item:any) => ({
      Nombre: item.nombre,
      Apellido: item.apellido,
      Sexo: item.sexo,
      Dni: item.dni,
      Edad: item.edad,
      Email: item.email,
      Rol: item.rol

    }));
    rows.sort((l:any,r:any) => l.Rol.localeCompare(r.Rol))
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, this.fileName);
  }
  
}
