import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  @ViewChild('table') table!: APIDefinition;

  configuration!: Config;
  data$!: Observable<any>;
  columns!: Columns[];  


  constructor(private auth: UserAuthService) {
  }

  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }


  ngOnInit(): void {
    this.configuration = {
      ...DefaultConfig,
      rows: 100 };
    this.columns  = [
      { key: '', title: '#', width: '3%' },
      { key: 'especialista', title: 'Especialista' },
      { key: 'paciente', title: 'Paciente' },
      { key: 'especialidadElegida', title: 'Especialidad' },
      { key: 'fecha', title: 'Fecha', orderBy: 'asc', searchEnabled: true },
      { key: 'diagnostico', title: 'Diagnostico', width: '50%' },
      { key: 'estado', title: 'Estado' },
      { key: '', title: 'Acciones' }
    ];
    this.data$ = this.auth.traerColeccionOrdenada('turnos', 'fecha');
    
  }

  async cancelarTurno(turno: any) {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Por qué quiere cancelar el turno?',
      inputPlaceholder: 'Escriba el comentario aquí...',
      inputAttributes: {
        'aria-label': 'Escriba el comentario aquí'
      },
      showCancelButton: true
    })
    if (text) {
      //Swal.fire(text)
      let obj = { estado: 'Cancelado', estaCancelado: true, comentario: 'Comentario genérico' };
      this.auth.actualizarEstadoTurno(obj, turno.uid, turno.paciente.uid, turno.especialista.uid);
    }
  }

  verComentario(turno: any) {
    Swal.fire({
      title: 'Reseña:',
      text: turno.comentario,
      confirmButtonText: 'Cerrar'
    });
  }

}
