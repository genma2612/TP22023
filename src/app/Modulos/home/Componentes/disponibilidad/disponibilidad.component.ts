import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Moment } from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

enum Dias {
  Domingo = 0,
  Lunes = 1,
  Martes = 2,
  Miercoles = 3,
  Jueves = 4,
  Viernes = 5,
  Sabado = 6
};

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css']
})
export class DisponibilidadComponent implements OnInit {

  formulario!: FormGroup;
  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  diasEnum = Dias;
  horarioSeleccionado:any;
  duracionHorario:number = 0;
  opcionesInhabilitadas = true;
  valoresHorario = [
    { horaInicio:0, horaFin:0 },
    { horaInicio:9, horaFin:14},
    { horaInicio:14, horaFin:19 },
    { horaInicio:9, horaFin:19 },
  ];
  valoresDuracion = [20,30,60];

  constructor(private fb: FormBuilder, private auth: UserAuthService, private spinner:NgxSpinnerService){
    this.formulario = this.fb.group({
      dias: new FormArray([])
    });
  }

  ModificarHorarioAlDia(dia:string, horario:string, index:number, rango:any) {
    const arreglo = this.formulario.get('dias') as FormArray;
    arreglo.removeAt(index);
    const grupo = this.fb.group({
      nombreDia: [dia],
      codDia: [index+1],
      horario: [horario],
      horaInicio: [rango.horaInicio],
      horaFin: [rango.horaFin]
    })
    arreglo.insert(index,grupo);
    console.info(arreglo.value);
  }


  onSubmit(f: any) {
    this.spinner.show();
    this.opcionesInhabilitadas = true;
    let usuario = JSON.parse(localStorage.getItem('usuarioActual')!);
    this.auth.updateHorario('usuarios', usuario.uid, this.formulario.get('dias')!.value).then(
      () => this.auth.traerUsuarioDeFirestore(this.auth.getUserFromAuth()).then(response => 
        {
          localStorage.setItem('usuarioActual', JSON.stringify(response.data()));
          this.spinner.hide();
      }
        ) //Actualiza en localstorage el horario
    );
  }

  cargarHorarioDeEspecialista(){ //Acá levanto el horario que tenía cargado anteriormente y lo asigno a los controles para chequear el que corresponda en el selector.
    this.horarioSeleccionado = JSON.parse(localStorage.getItem('usuarioActual')!).horario;
    this.duracionHorario = JSON.parse(localStorage.getItem('usuarioActual')!).duracionTurnos;
    const arreglo = this.formulario.get('dias') as FormArray;
    for (let index = 0; index < this.horarioSeleccionado.length; index++) {
      const element = this.horarioSeleccionado[index];
      let grupo = this.fb.group({
        nombreDia: [element.nombreDia],
        codDia: [element.codDia],
        horario: [element.horario],
        horaInicio: [element.horaInicio],
        horaFin: [element.horaFin]
      })
      arreglo.push(grupo);
    }
  }

  cambiarDuracion(duracion:number){
    this.spinner.show();
    let usuario = JSON.parse(localStorage.getItem('usuarioActual')!);
    this.duracionHorario = duracion;
    this.auth.updateDuracion('usuarios', usuario.uid, duracion).then(
      () => this.auth.traerUsuarioDeFirestore(this.auth.getUserFromAuth()).then(
        response => 
        {
          localStorage.setItem('usuarioActual', JSON.stringify(response.data()));
          this.spinner.hide();
      }) //Actualiza en localstorage el horario
    );
  }

  modificar(){
    this.opcionesInhabilitadas = false;
  }


  ngOnInit(): void {
    this.cargarHorarioDeEspecialista();
  }

}
