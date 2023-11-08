import { Component, OnInit, Output, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Turno, Paciente, Especialista } from 'src/app/Clases/interfaces';
import { DocumentData, Timestamp } from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Observable, first } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent implements OnInit {
  especialidadesFire: any[] = [];
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
  horarios: any[] = [[], [], [], []];
  isBtnActive = 0;

  constructor(private fb: FormBuilder, private auth: UserAuthService, private spinner: NgxSpinnerService) {
    this.formulario = this.fb.group({
      'paciente': [null, [Validators.required]],
      'especialista': ["Elegir especialista", [Validators.required]]
    });


  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.esAdmin()) {
      this.auth.traerColeccionUsuariosEspecifica('paciente').pipe(first()).subscribe(
        response => this.pacientesFire = response
      )
    }
    else {
      this.formulario.controls['paciente'].setValue(this.auth.getUsuarioLocalstorage())
    }
    this.auth.traerColeccionUsuariosEspecifica('especialista').pipe(first()).subscribe(
      response => {
        this.especialistasFire = response
        this.especialistasFire.forEach(especialista => {
          especialista.especialidades.forEach((element: any) => {
            if (this.tieneHorarioHabilitado(especialista, element))
              this.especialidades.push(element);
            this.spinner.hide();
          })
        })
        this.especialidades = this.filtrarArray(this.especialidades);
      }
    )
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
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

  seleccionarEspecialidaD(especialidad: string, id: number) {
    this.doctorSeleccionado = null;
    this.fechaSeleccionada = null;
    this.especialidadSeleccionada = especialidad;
    this.isBtnActive = id;
  }

  seleccionarDoctor(especialistaElegido: any) {
    this.fechaSeleccionada = null;
    this.doctorSeleccionado = especialistaElegido;
    this.horarios = [[], [], [], []];
    this.traerTurnosDelEspecialistaElegido();
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
        if (dia.codDia > fechaHoy) {
          for (let i = horaInicio; i < horaFin; i += 1) {
            for (let j = minutos; j < 60; j += dia.duracionDelDia) {
              fechaArmada = moment().hours(i).minutes(j).second(0).day(dia.codDia).toDate();
              if (this.estaDisponible(fechaArmada))
                this.horarios[0].push(fechaArmada);
            }
          }
        }
        for (let i = horaInicio; i < horaFin; i += 1) {
          for (let j = minutos; j < 60; j += dia.duracionDelDia) {
            fechaArmada = moment().hours((i)).minutes(j).second(0).day(dia.codDia).add('1', 'weeks').toDate();
            if (this.estaDisponible(fechaArmada))
              this.horarios[1].push(fechaArmada);
          }
        }
        for (let i = horaInicio; i < horaFin; i += 1) {
          for (let j = minutos; j < 60; j += dia.duracionDelDia) {
            fechaArmada = moment().hours((i)).minutes(j).second(0).day(dia.codDia).add('2', 'weeks').toDate();
            if (this.estaDisponible(fechaArmada))
              this.horarios[2].push(fechaArmada);
          }
        }
        for (let i = horaInicio; i < horaFin; i += 1) {
          for (let j = minutos; j < 60; j += dia.duracionDelDia) {
            fechaArmada = moment().hours((i)).minutes(j).second(0).day(dia.codDia).add('3', 'weeks').toDate();
            if (this.estaDisponible(fechaArmada))
              this.horarios[3].push(fechaArmada);
          }
        }

        this.horarios[0].sort((a: Date, b: Date) => { return a.getTime() - b.getTime(); });
        this.horarios[1].sort((a: Date, b: Date) => { return a.getTime() - b.getTime(); });
        this.horarios[2].sort((a: Date, b: Date) => { return a.getTime() - b.getTime(); });

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
  
    estaDisponible(fecha: Date):boolean {
      if(this.turnosDelDoctorSeleccionado.length > 0){ 
        //console.info('Tiene horarios');
        return !this.turnosDelDoctorSeleccionado.find(item => {
          return item.toString() == fecha.toString() //Consulto si estaDisponible porque, en caso de cancelar, puedo usar la misma fecha y horario
        }
        );
      }
      else{
        //console.info('No tiene horarios');
        return true;
      }
    }
  

  traerTurnosDelEspecialistaElegido() {
    return this.auth.traerColeccionOrdenada(`usuarios/${this.doctorSeleccionado!.uid}/turnos`, 'fecha').pipe(first()).subscribe( //.pipe(first()) cierra la suscripción automaticamente
      response => {
        response.map(
          item => {
            if(item['estaCancelado'] == false){
              console.info(item);
              this.turnosDelDoctorSeleccionado.push(item['fecha'].toDate())
            }
          } 
        )
        this.generarHorario(this.doctorSeleccionado);
      }
    )
  }

  seleccionarHorario(fecha: Date) {
    this.fechaSeleccionada = fecha;
  }


  generarTurno(paciente: Paciente) {
    let mensaje: string = `Desea solicitar cita para  ${this.especialidadSeleccionada} con ${this.doctorSeleccionado?.nombre} ${this.doctorSeleccionado?.apellido} en el día ${moment(this.fechaSeleccionada).format('DD/MM')} a las ${moment(this.fechaSeleccionada).format('HH:mm')}?`;
    if (this.doctorSeleccionado != null) {
      Swal.fire({
        title: "Confirmación de turno",
        text: mensaje,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.spinner.show();
          let turno: Turno;
          turno = new Turno(paciente, this.doctorSeleccionado!, 'Pendiente', this.fechaSeleccionada!, '', '', {}, {}, false, '', 30, this.especialidadSeleccionada!);
          this.auth.guardarTurno(turno).then(
            response => {
              this.reiniciarForm();
              this.spinner.hide();
              Swal.fire("Turno guardado!", "", "success");
            }
          )
        } else if (result.isDismissed) {
          Swal.fire("Se cancelo la solicitud del turno", "", "info");
        }
      });
    }
  }

  comprobarFormulario() {
    let retorno = true;
    if (this.formulario.controls['paciente'].valid && this.especialidadSeleccionada != null && this.doctorSeleccionado != null && this.fechaSeleccionada != null) {
      retorno = false;
    }
    return retorno;
  }

  reiniciarForm() {
    this.traerTurnosDelEspecialistaElegido().unsubscribe();
    this.especialidadSeleccionada = '';
    this.doctorSeleccionado = null;
    this.fechaSeleccionada = null;
    this.formulario.reset();
    if (!this.esAdmin())
      this.formulario.controls['paciente'].setValue(this.auth.getUsuarioLocalstorage());
  }

}

