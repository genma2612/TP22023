import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent {


  formulario!: FormGroup;
  especialidades: string[] = [];
  especialidadSeleccionada: string|null = '';
  doctorSeleccionado!: IEspecialista | null;
  fechaSeleccionada!: Date | null;

  horarios: Date[] = [];
  startDate = new Date('2023-11-01');
  endDate = new Date('2023-11-07');


  pacientes: IPaciente[] = [
    { nombre: 'José', apellido: 'Pérez' },
    { nombre: 'Luis', apellido: 'García' },
    { nombre: 'Pedro', apellido: 'López' },
    { nombre: 'Alan', apellido: 'Brado' },
    { nombre: 'Omar', apellido: 'Báez' }];

  especialistas: IEspecialista[] =
    [
      { nombre: 'Sauncho', apellido: 'Dudin', especialidades: ['Cardiología', 'Traumatología'], diasDeAtención: [1, 2, 3, 4, 5, 6] },
      { nombre: 'Ellsworth', apellido: 'Stather', especialidades: ['Traumatología', 'Pediatría'], diasDeAtención: [2, 4] },
      { nombre: 'Onofredo', apellido: 'Prestner', especialidades: ['Pediatría', 'Podología'], diasDeAtención: [1, 5] },
      { nombre: 'Cornelius', apellido: 'Serle', especialidades: ['Podología', 'Dermatología'], diasDeAtención: [4, 5] },
      { nombre: 'Udale', apellido: 'Sarfass', especialidades: ['Dermatología', 'Traumatología', 'Cardiología'], diasDeAtención: [1, 5, 6] }];

  turnos: ITurno[] = [{
    especialista: {
      nombre: "Onofredo",
      apellido: "Prestner",
      especialidades: [
        "Pediatría",
        "Podología"
      ],
      diasDeAtención: [
        1,
        5
      ]
    },
    paciente: {
      nombre: "Luis",
      apellido: "García"
    },
    especialidad: "Pediatría",
    estado: "Pendiente",
    reseña: "Ninguna",
    fecha: moment("2023-11-06T12:00:51.867Z").toDate()
  },
  {
    especialista: {
      nombre: "Sauncho",
      apellido: "Dudin",
      especialidades: [
        "Cardiología",
        "Traumatología"
      ],
      diasDeAtención: [
        1,
        2,
        3,
        4,
        5,
        6
      ]
    },
    paciente: {
      nombre: "Alan",
      apellido: "Brado"
    },
    especialidad: "Traumatología",
    estado: "Pendiente",
    reseña: "Ninguna",
    fecha: moment("2023-11-09T12:00:58.462Z").toDate()
  },
  {
    especialista: {
      nombre: "Cornelius",
      apellido: "Serle",
      especialidades: [
        "Podología",
        "Dermatología"
      ],
      diasDeAtención: [
        4,
        5
      ]
    },
    paciente: {
      nombre: "Alan",
      apellido: "Brado"
    },
    especialidad: "Podología",
    estado: "Pendiente",
    reseña: "Ninguna",
    fecha: moment("2023-11-03T12:00:04.259Z").toDate()
  }];


  constructor(private fb: FormBuilder, private auth: UserAuthService) {
    this.formulario = this.fb.group({
      'paciente': [null, [Validators.required]],
      'especialista': ["Elegir especialista", [Validators.required]]
    });
    this.especialistas.forEach(especialista => {
      especialista.especialidades.forEach(element => {
        this.especialidades.push(element);
      });
    })
    this.especialidades = this.filtrarArray(this.especialidades);
    if(!this.esAdmin()){
      this.formulario.controls['paciente'].setValue({nombre:this.auth.getUsuarioLocalstorage().nombre, apellido:this.auth.getUsuarioLocalstorage().apellido});
    }
  }

  esAdmin(){
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

  seleccionarDoctor(especialistaElegido: IEspecialista) {
    this.fechaSeleccionada = null;
    this.doctorSeleccionado = especialistaElegido;
    this.horarios = [];
    this.generarHorario(this.doctorSeleccionado);
  }

  generarHorario(doctorSeleccionado: IEspecialista) {
    let hora = 9;
    let minutos = 0;
    let fechaHoy = moment().isoWeekday();
    doctorSeleccionado.diasDeAtención.forEach(dia => {
      if (dia <= fechaHoy) {
        this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).add('1', 'weeks').toDate());
        this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).add('2', 'weeks').toDate());
      }
      else {
        this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).toDate());
        this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).add('1', 'weeks').toDate());
      }
    })
  }

  estaDisponible() {
    let retorno = false;
    return retorno;
  }

  seleccionarHorario(fecha: Date) {
    this.fechaSeleccionada = fecha;
  }


  generarTurno(paciente: IPaciente, especialista: IEspecialista) {
    //console.info(paciente.nombre, especialista.nombre);
    if (this.doctorSeleccionado != null) {
      let turno: ITurno = { especialista: this.doctorSeleccionado, paciente: paciente, especialidad: this.especialidadSeleccionada!, estado: 'Pendiente', reseña: 'Ninguna', fecha: this.fechaSeleccionada };
      this.turnos.push(turno);
    }
  }

  comprobarFormulario() {
    let retorno = true;
    if (this.formulario.controls['paciente'].valid && this.especialidadSeleccionada != null && this.doctorSeleccionado != null && this.fechaSeleccionada != null) {
      retorno = false;
    }
    return retorno;
  }

  reiniciarForm(){
    this.especialidadSeleccionada = '';
    this.doctorSeleccionado = null;
    this.fechaSeleccionada = null;
    this.formulario.reset();
    this.formulario.controls['paciente'].setValue({nombre:this.auth.getUsuarioLocalstorage().nombre, apellido:this.auth.getUsuarioLocalstorage().apellido});

  }



}

export interface ITurno {
  paciente:IPaciente;
  especialidad:string;
  especialista:IEspecialista;
  fecha:Date|null;
  estado:string;
  reseña:string;
}

export interface IEspecialista {
  nombre:string;
  apellido:string;
  especialidades:string[];
  diasDeAtención:number[];
}

export interface IPaciente {
  nombre:string;
  apellido:string;
}

