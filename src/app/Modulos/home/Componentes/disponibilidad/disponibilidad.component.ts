import { Component, Input, OnInit } from '@angular/core';
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
  @Input() usuario:any;

  modificacionHabilitada = false;
  formulario!: FormGroup;
  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  especialidadesDelEspecialista = []
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
    this.actualizarHorarios(formulario);
  }

  actualizarHorarios(formulario:any){
    console.info(formulario.value)
    this.spinner.show();
    this.auth.updateHorario('usuarios', this.usuario.uid, formulario.value).then(
      () => this.auth.traerUsuarioDeFirestore(this.auth.getUserFromAuth()).then(response => 
        {
          localStorage.setItem('usuarioActual', JSON.stringify(response.data())); //Actualiza los nuevos horarios en localstorage
          this.spinner.hide();
          this.formulario.disable();
          this.modificacionHabilitada = false;
      }
        ) 
    );
  }

  habilitarModificacion(){
    this.formulario.enable();
    this.modificacionHabilitada = true;
  }

  cancelarModificacion(){
    this.formulario.disable();
    this.modificacionHabilitada = false;
    this.formulario.setValue(JSON.parse(localStorage.getItem('usuarioActual')!).horario);
  }

  cargarHorarioDeEspecialista(){ //Acá levanto el horario que tenía cargado anteriormente y lo asigno a los controles para chequear el que corresponda en el selector.
    this.definirEstructuraDelFormulario();
    this.formulario.setValue(JSON.parse(localStorage.getItem('usuarioActual')!).horario);

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
    this.formulario.disable();
  }

  ngOnInit(): void {
    this.cargarHorarioDeEspecialista();
  }

}
