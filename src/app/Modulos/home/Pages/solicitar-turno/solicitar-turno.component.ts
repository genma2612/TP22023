import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Turno, Paciente, Especialista } from 'src/app/Clases/interfaces';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent {
  pacientesFire: any[] = [];
  especialistasFire: any[] = [];
  testVariable = 'Aceptado';

  formulario!: FormGroup;
  especialidades: string[] = [];
  especialidadSeleccionada: string | null = '';
  doctorSeleccionado!: Especialista | null;
  turnosDelDoctorSeleccionado: any[] = [];
  fechaSeleccionada!: Date | null;
  pacienteActual: any;
  horarios: Date[] = [];


  constructor(private fb: FormBuilder, private auth: UserAuthService) {
    this.formulario = this.fb.group({
      'paciente': [null, [Validators.required]],
      'especialista': ["Elegir especialista", [Validators.required]]
    });
    if (this.esAdmin()) {
      this.auth.traerColeccionUsuariosEspecifica('paciente').subscribe(
        response => this.pacientesFire = response
      )
    }
    else {
      this.formulario.controls['paciente'].setValue(this.auth.getUsuarioLocalstorage());
    }

    this.auth.traerColeccionUsuariosEspecifica('especialista').subscribe(
      response => {
        this.especialistasFire = response
        this.especialistasFire.forEach(especialista => {
          especialista.especialidades.forEach((element: any) => {
            this.especialidades.push(element);
          })
        })
        this.especialidades = this.filtrarArray(this.especialidades);
      }
    )
  }

  esAdmin() {
    return this.auth.getUsuarioLocalstorage().rol == 'administrador';
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

  seleccionarEspecialidaD(especialidad: string) {
    this.doctorSeleccionado = null;
    this.fechaSeleccionada = null;
    this.especialidadSeleccionada = especialidad;
  }

  seleccionarDoctor(especialistaElegido: any) {
    this.fechaSeleccionada = null;
    this.doctorSeleccionado = especialistaElegido;
    this.horarios = [];
    this.traerTurnosDelEspecialistaElegido();
    //this.generarHorario(this.doctorSeleccionado);
  }

  generarHorario(doctorSeleccionado: any) {
    let fechaArmada: Date;
    let horaInicio = 0;
    let minutos = 0;
    let horaFin = 0;
    let fechaHoy = moment().day();
    Object.values(doctorSeleccionado.horario).forEach((dia: any) => {
      if (dia.rango.horaInicio != 0 && dia.especialidadDelDia == this.especialidadSeleccionada) {
        horaInicio = dia.rango.horaInicio;
        horaFin = dia.rango.horaFin;
        if (moment(dia.codDia).day() <= fechaHoy) {
          for (let i = horaInicio; i < horaFin; i += 1) {
            for (let j = minutos; j < 60; j += dia.duracionDelDia) {
              fechaArmada = moment().hours((i)).minutes(j).second(0).day(dia.codDia).add('1', 'weeks').toDate();
              if (this.estaDisponible(fechaArmada))
                this.horarios.push(fechaArmada);
            }
          }
          for (let i = horaInicio; i < horaFin; i += 1) {
            for (let j = minutos; j < 60; j += dia.duracionDelDia) {
              fechaArmada = moment().hours((i)).minutes(j).second(0).day(dia.codDia).add('2', 'weeks').toDate();
              if (this.estaDisponible(fechaArmada))
                this.horarios.push(fechaArmada);
            }
          }
        }
        else {
          for (let i = horaInicio; i < horaFin; i += 1) {
            for (let j = minutos; j < 60; j += dia.duracionDelDia) {
              fechaArmada = moment().hours(i).minutes(j).second(0).day(dia.codDia).toDate();
              if (this.estaDisponible(fechaArmada))
                this.horarios.push(fechaArmada);
            }
          }
          for (let i = horaInicio; i < horaFin; i += 1) {
            for (let j = minutos; j < 60; j += dia.duracionDelDia) {
              fechaArmada = moment().hours((i)).minutes(j).second(0).day(dia.codDia).add('1', 'weeks').toDate();
              if (this.estaDisponible(fechaArmada))
                this.horarios.push(fechaArmada);
            }
          }
        }
      }

    })
  }

  tieneHorarioHabilitado(especialista: any, especialidadSeleccionada: string) {
    let arrayHorarios = Object.values(especialista.horario); //convierte el obj de Firebase a Array
    let retorno = false;
    arrayHorarios.forEach((element: any) => {
      if (element.rango.horaInicio != 0 && element.especialidadDelDia == especialidadSeleccionada) {
        retorno = true;
      }
    });
    return retorno;
  }

  estaDisponible(fecha: Date) {
    return !this.turnosDelDoctorSeleccionado.find(item => {
      return item.toString() == fecha.toString()
    }
    );
  }

  traerTurnosDelEspecialistaElegido() {
    this.auth.traerColeccionOrdenada(`usuarios/${this.doctorSeleccionado!.uid}/turnos`, 'fecha').subscribe(
      response => {
        response.map(
          item => this.turnosDelDoctorSeleccionado.push(item['fecha'].toDate())
        )
        //console.info(this.turnosDelDoctorSeleccionado);
        this.generarHorario(this.doctorSeleccionado);
      }
    )
  }

  seleccionarHorario(fecha: Date) {
    this.fechaSeleccionada = fecha;
  }


  generarTurno(paciente: Paciente, especialista: Especialista) {
    if (this.doctorSeleccionado != null) {
      let turno: Turno;
      turno = new Turno(paciente, this.doctorSeleccionado, 'Pendiente', this.fechaSeleccionada!, '', '', '', false, '', 30, this.especialidadSeleccionada!);
      this.auth.guardarTurno(turno).then(
        response => {
          console.info(response);
          this.reiniciarForm();
        }
      )
    }

  }

  actualizarTurno() {
    this.auth.actualizarEstadoTurno(this.testVariable, 'WNg9jMM4CHq8F7v61QLt', "13tHHLfn3ghb2C9czhGcfPckdo53", "KutShjvlDAYxUn2u3Gxjk5ywURJ3");
  }

  comprobarFormulario() {
    let retorno = true;
    if (this.formulario.controls['paciente'].valid && this.especialidadSeleccionada != null && this.doctorSeleccionado != null && this.fechaSeleccionada != null) {
      retorno = false;
    }
    return retorno;
  }

  reiniciarForm() {
    this.especialidadSeleccionada = '';
    this.doctorSeleccionado = null;
    this.fechaSeleccionada = null;
    this.formulario.reset();
    if (!this.esAdmin())
      this.formulario.controls['paciente'].setValue(this.auth.getUsuarioLocalstorage());
  }

}

