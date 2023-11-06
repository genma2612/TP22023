import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Moment } from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css']
})
export class DisponibilidadComponent implements OnInit {

  formulario!: FormGroup;
  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  especialidadesDelEspecialista = []
  horarioSeleccionado:any;
  valoresHorario = [
    { horaInicio: 8, horaFin: 14 },
    { horaInicio: 14, horaFin: 19 },
    { horaInicio: 8, horaFin: 19 },
    { horaInicio: 0, horaFin: 0 }
  ];
  valoresDuracion = [20,30,60];

  constructor(private fb: FormBuilder, private auth: UserAuthService, private spinner:NgxSpinnerService){
    this.especialidadesDelEspecialista = this.auth.getUsuarioLocalstorage().especialidades;
  }

  onSubmit(formulario:any) {
    console.info(formulario.value)
    this.spinner.show();
    let usuario = JSON.parse(localStorage.getItem('usuarioActual')!);
    this.auth.updateHorario('usuarios', usuario.uid, formulario.value).then(
      () => this.auth.traerUsuarioDeFirestore(this.auth.getUserFromAuth()).then(response => 
        {
          localStorage.setItem('usuarioActual', JSON.stringify(response.data()));
          this.spinner.hide();
      }
        ) //Actualiza en localstorage el horario
    );
    
  }

  cargarHorarioDeEspecialista(){ //Acá levanto el horario que tenía cargado anteriormente y lo asigno a los controles para chequear el que corresponda en el selector.
    this.definirEstructuraDelFormulario();
    this.horarioSeleccionado = JSON.parse(localStorage.getItem('usuarioActual')!).horario;
    this.formulario.setValue(this.horarioSeleccionado);
  }

  compare(val1:any, val2:any) { //funcion que hace que [compareWith] seleccione la opción correcta
    return val1.horaInicio === val2.horaInicio && val1.horaFin === val2.horaFin;
  }


  definirEstructuraDelFormulario(){
    this.formulario = this.fb.group({
      Lunes: this.fb.group({
        'nombreDia': 'Lunes',
        'codDia': 1,
        'rango': {horaInicio:0, horaFin:0},
        'duracionDelDia': 30,
        'especialidadDelDia': 'A'
      }),
      Martes: this.fb.group({
        'nombreDia': 'Martes',
        'codDia': 2,
        'rango': {horaInicio:0, horaFin:0},
        'duracionDelDia': 30,
        'especialidadDelDia': 'A',
      }),
      Miercoles: this.fb.group({
        'nombreDia': 'Miercoles', 
        'codDia': 3,
        'rango': {horaInicio:0, horaFin:0},
        'duracionDelDia': 30,
        'especialidadDelDia': 'A',
      }),
      Jueves: this.fb.group({
        'nombreDia': 'Jueves',
        'codDia': 4,
        'rango': {horaInicio:0, horaFin:0},
        'duracionDelDia': 30,
        'especialidadDelDia': 'A',
      }),
      Viernes: this.fb.group({
        'nombreDia': 'Viernes',
        'codDia': 5,
        'rango': {horaInicio:0, horaFin:0},
        'duracionDelDia': 30,
        'especialidadDelDia': 'A',
      }),
      Sabado: this.fb.group({
        'nombreDia': 'Sabado',
        'codDia': 6,
        'rango': {horaInicio:0, horaFin:0},
        'duracionDelDia': 30,
        'especialidadDelDia': 'A'
      }),
    });
  }


  ngOnInit(): void {
    this.cargarHorarioDeEspecialista();
  }

}
