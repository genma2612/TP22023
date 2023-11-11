import { Component, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Especialista } from 'src/app/Clases/interfaces';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import * as XLSX from 'xlsx'; //excel

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  tipoUsuario = 'administrador';
  coleccionUsuarios: any;
  hc: any;
  pacienteSeleccionado: any;

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

  verHC(paciente: any) {
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


  cerrarModal() {
    document.getElementById('closeModalBtn')?.click();
  }

  exportexcel() {
    /* table id is passed over here */
    //let element = document.getElementById('tablaPacientes');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('tablaPacientes'));
    const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('tablaEspecialistas'));
    const ws3: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('tablaAdmin'));
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');
    XLSX.utils.book_append_sheet(wb, ws2, 'Especialistas');
    XLSX.utils.book_append_sheet(wb, ws3, 'Admins');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  
}
