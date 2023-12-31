import { Component, OnInit, ViewChild } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Turno } from 'src/app/Clases/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Observable, first, last } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';


@Component({
  selector: 'app-misturnos',
  templateUrl: './misturnos.component.html',
  styleUrls: ['./misturnos.component.css']
})
export class MisturnosComponent implements OnInit {
  @ViewChild('table') table!: APIDefinition;

  arrayPacientes: string[] = [];
  arrayEspecialistas: string[] = [];
  arrayEspecialidades: string[] = [];

  turnos: any;
  turnos$: Observable<DocumentData[]>;

  accionActual = '';
  turnoSeleccionado!: Turno;

  usuarioActual: any;

  formulario!: FormGroup;

  public configuration!: Config;
  public data$!: Observable<any>;
  public columns!: Columns[];
  public configuration2!: Config;
  public columns2!: Columns[];


  constructor(private auth: UserAuthService, private fb: FormBuilder, private spinner: NgxSpinnerService) {
    this.usuarioActual = this.auth.getUsuarioLocalstorage();
    this.auth.traerColeccionOrdenada(`usuarios/${this.usuarioActual.uid}/turnos`, 'fecha').subscribe(
      response => {
        this.turnos = response;
        this.turnos.forEach((element: any) => {
          this.arrayEspecialidades.push(element.especialidadElegida);
          if (this.usuarioActual.rol == 'especialista')
            this.arrayPacientes.push(element.paciente.nombre + ' ' + element.paciente.apellido);
          if (this.usuarioActual.rol == 'paciente')
            this.arrayEspecialistas.push(element.especialista.nombre + ' ' + element.especialista.apellido);
        }
        
        );
        this.arrayEspecialidades = this.filtrarArray(this.arrayEspecialidades);
        if (this.usuarioActual.rol == 'paciente')
          this.arrayEspecialistas = this.filtrarArray(this.arrayEspecialistas);
        if (this.usuarioActual.rol == 'especialista')
          this.arrayPacientes = this.filtrarArray(this.arrayPacientes);
      }
    )
    this.turnos$ = this.auth.traerColeccionOrdenada(`usuarios/${this.usuarioActual.uid}/turnos`, 'fecha');
  }


  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }

  filtrarArray(arr: any[]) {
    let m: any = {}
    let newarr = []
    for (let i = 0; i < arr.length; i++) {
      let v = arr[i];
      if (!m[v]) {
        newarr.push(v);
        m[v] = true;
      }
    }
    return newarr;
  }

  ngOnInit(): void {

    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: '', title: '#', width: '3%' },
      { key: 'paciente', title: 'Paciente' },
      { key: 'especialidadElegida', title: 'Especialidad' },
      { key: 'fecha', title: 'Fecha' },
      { key: 'diagnostico', title: 'Diagnostico', width: '50%' },
      { key: 'estado', title: 'Estado' },
      { key: '', title: 'Acciones' }
    ];
    this.configuration2 = { ...DefaultConfig };
    this.columns2 = [
      { key: '', title: '#', width: '3%' },
      { key: 'especialista', title: 'Especialista' },
      { key: 'especialidadElegida', title: 'Especialidad' },
      { key: 'fecha', title: 'Fecha' },
      { key: 'diagnostico', title: 'Diagnostico', width: '50%' },
      { key: 'estado', title: 'Estado' },
      { key: '', title: 'Acciones' }
    ];
    this.data$ = this.auth.traerColeccionOrdenada(`usuarios/${this.usuarioActual.uid}/turnos`, 'fecha');
    this.formulario = this.fb.group({
      'comentario': ['', [Validators.required]],
    });
  }


  realizarAccion(turno: Turno, accion: string) { //Hacer un switch? Ya nadie los usa :P
    this.turnoSeleccionado = turno;
    this.accionActual = accion;
    if (accion == 'Cancelado' || accion == 'Rechazado') {
      this.cancelarORechazarTurno(turno, accion);
    }
    if (accion == 'verComentario') {
      Swal.fire({
        title: 'Reseña:',
        text: turno.comentario,
        confirmButtonText: 'Cerrar'
      });
    }
    if (accion == 'Atendiendo') {
      this.aceptarTurno(turno, accion);
    }
    if (accion == 'Realizado') {
      document.getElementById('abrirModalHC')?.click();
    }
    if (accion == 'realizarEncuesta') {
      document.getElementById('abrirModalEncuesta')?.click();
    }
    if (accion == 'calificarAtencion') {
      this.calificarAtencion(this.turnoSeleccionado);
    }
    if (accion == 'verCalificacion') {
      Swal.fire({
        title: 'Calificación:',
        text: turno.calificacion,
        confirmButtonText: 'Cerrar'
      });
    }
  }

  calificarAtencion(turno: Turno) {
    Swal.fire({
      title: "Calificar la atención recibida:",
      input: "text",
      inputLabel: "Describa brevemente la atención.",
      inputValue: '',
      showCancelButton: true,
      preConfirm: (text) => {
        if (!text) {
          Swal.showValidationMessage(
            'La calificación no puede dejarse vacía'
          )
        }
        else {
          let obj = { calificacion: text };
          this.spinner.show();
          this.auth.actualizarEstadoTurno(obj, turno.uid, this.usuarioActual.uid, turno.especialista.uid!).then(
            () => {
              this.spinner.hide()
              Swal.fire({
                title: 'Gracias por su opinión!',
                text: 'Se ha guardado su calificación',
                confirmButtonText: 'Cerrar'
              });
            }
          );
        }
      }
    });

  }

  aceptarTurno(turno: Turno, accion: string) {
    let obj = { estado: accion };
    this.spinner.show();
    this.auth.actualizarEstadoTurno(obj, turno.uid, turno.paciente.uid!, this.usuarioActual.uid).then(
      () => {
        Swal.fire({
          title: 'Turno aceptado',
          text: 'Comienza la atención del paciente ' + turno.paciente.nombre + ' ' + turno.paciente.apellido,
          confirmButtonText: 'Cerrar'
        });
        this.spinner.hide()
      }
    );
  }

  finalizarTurno($event: any) {
    document.getElementById('abrirModalHC')?.click();
    let obj = { estado: 'Realizado', comentario: 'El paciente fué atendido, consulte el diagnóstico en su historial médico', diagnostico: $event };
    this.spinner.show();
    this.auth.actualizarEstadoTurno(obj, this.turnoSeleccionado.uid, this.turnoSeleccionado.paciente.uid!, this.usuarioActual.uid).then(
      () => {
        if (!this.turnoSeleccionado.paciente.tieneHC) {
          this.auth.updateTieneHC(this.turnoSeleccionado.paciente.uid).then(
            () => {
              this.spinner.hide();
              Swal.fire({
                title: 'Turno finalizado.',
                text: 'La historia clínica se cargó correctamente',
                confirmButtonText: 'Cerrar'
              });
            }
          )
        }
        this.spinner.hide();
        Swal.fire({
          title: 'Turno finalizado.',
          text: 'La historia clínica se cargó correctamente',
          confirmButtonText: 'Cerrar'
        });
      }
    )
  }


  cargarEncuesta($event: any) {
    let obj = { encuestaCargada: true };
    document.getElementById('abrirModalEncuesta')?.click();
    this.spinner.show();
    this.auth.guardarEncuesta($event).then(
      () => {
        this.auth.actualizarEstadoTurno(obj, this.turnoSeleccionado.uid, this.usuarioActual.uid, this.turnoSeleccionado.especialista.uid!).then(
          () => {
            this.spinner.hide();
            Swal.fire({
              title: 'Muchas gracias!',
              text: 'La encuesta se cargó correctamente',
              confirmButtonText: 'Cerrar'
            });
          }
        )
      }
    )

  }




  cancelarORechazarTurno(turno: Turno, accion: string) {
    Swal.fire({
      title: "Confirmación:",
      input: "text",
      inputLabel: "Describa el motivo",
      inputValue: '',
      showCancelButton: true,
      preConfirm: (text) => {
        if (!text) {
          Swal.showValidationMessage(
            'El comentario no puede dejarse vacío'
          )
        }
        else {
          this.spinner.show();
          let obj = { estado: accion, estaCancelado: true, comentario: text };
          if (this.usuarioActual.rol == 'paciente') {
            this.auth.actualizarEstadoTurno(obj, turno.uid, this.usuarioActual.uid, turno.especialista.uid!).then(
              () => {
                Swal.fire({
                  text: accion + ' correctamente',
                  icon: 'success',
                  confirmButtonText: 'Cerrar'
                });
                this.spinner.hide();
              }
            );
          }
          if (this.usuarioActual.rol == 'especialista') {
            this.auth.actualizarEstadoTurno(obj, turno.uid, turno.paciente.uid!, this.usuarioActual.uid).then(
              () => {
                Swal.fire({
                  text: accion + ' correctamente',
                  icon: 'success',
                  confirmButtonText: 'Cerrar'
                });
                this.spinner.hide();
              }
            );
          }
        }
      }
    });
  }

}
