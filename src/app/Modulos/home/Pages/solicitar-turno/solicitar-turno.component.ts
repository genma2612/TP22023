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
  pacientesFire:any[] = [];
  especialistasFire:any[] = [];
  testVariable = 'Aceptado';

  formulario!: FormGroup;
  especialidades: string[] = [];
  especialidadSeleccionada: string|null = '';
  doctorSeleccionado!: Especialista | null;
  fechaSeleccionada!: Date | null;
  pacienteActual:any;
  horarios: Date[] = [];
  startDate = new Date('2023-11-01');
  endDate = new Date('2023-11-07');


  constructor(private fb: FormBuilder, private auth: UserAuthService) {
    this.formulario = this.fb.group({
      'paciente': [null, [Validators.required]],
      'especialista': ["Elegir especialista", [Validators.required]]
    });
    if(this.esAdmin()){
      this.auth.traerColeccionUsuariosEspecifica('paciente').subscribe(
        response => this.pacientesFire = response
      )
    }
    else{
      this.formulario.controls['paciente'].setValue(this.auth.getUsuarioLocalstorage());
    }

    this.auth.traerColeccionUsuariosEspecifica('especialista').subscribe(
      response => {
        this.especialistasFire = response
        this.especialistasFire.forEach(especialista => {
          especialista.especialidades.forEach((element:any) =>{
            this.especialidades.push(element);
          })
        })
        this.especialidades = this.filtrarArray(this.especialidades);
      }
    )
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

  seleccionarDoctor(especialistaElegido:any) {

    this.fechaSeleccionada = null;
    this.doctorSeleccionado = especialistaElegido;
    this.horarios = [];
    this.generarHorario(this.doctorSeleccionado);
  }

  generarHorario(doctorSeleccionado:any) {
    let hora = 9;
    let minutos = 0;
    let fechaHoy = moment().day();
    console.info('fecha hoy', fechaHoy);
    doctorSeleccionado.horario.forEach((dia:any) => {
      if(this.tieneHorarioHabilitado(doctorSeleccionado)){
        if (moment(dia.codDia).day() <= fechaHoy) {
          this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).add('1', 'weeks').toDate());
          this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).add('2', 'weeks').toDate());
        }
        else {
          this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).toDate());
          this.horarios.push(moment().hours(hora).minutes(minutos).day(dia).add('1', 'weeks').toDate());
        }
      }

    })
  }

  tieneHorarioHabilitado(especialista:any){
    let retorno = false;
    especialista.horario.forEach((element:any) => {
      if(element.horario != 'no'){
        retorno = true;
      }
    });
    return retorno;
  }

  estaDisponible() {
    let retorno = false;
    return retorno;
  }

  seleccionarHorario(fecha: Date) {
    this.fechaSeleccionada = fecha;
  }


  generarTurno(paciente: Paciente, especialista: Especialista) {
    //console.info(paciente.nombre, especialista.nombre);
    if (this.doctorSeleccionado != null) {
      //let turno: ITurno = { especialista: this.doctorSeleccionado, paciente: paciente, especialidad: this.especialidadSeleccionada!, estado: 'Pendiente', reseña: 'Ninguna', fecha: this.fechaSeleccionada };
      //this.turnos.push(turno);
      let turno:Turno;
      turno = new Turno(paciente, this.doctorSeleccionado, 'Pendiente', this.fechaSeleccionada!,'','', '', false,'', this.doctorSeleccionado.duracionTurnos!, this.especialidadSeleccionada!);
      this.auth.guardarTurno(turno)//.then(
      //  response => console.info(response)
      //)
    }

  }

  actualizarTurno(){
    this.auth.actualizarEstadoTurno(this.testVariable,'WNg9jMM4CHq8F7v61QLt', "13tHHLfn3ghb2C9czhGcfPckdo53", "KutShjvlDAYxUn2u3Gxjk5ywURJ3");
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

