import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css']
})
export class DisponibilidadComponent {

  formulario!: FormGroup;
  isEnabled = false;
  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  //diaPrototipo = { dia:}

  constructor(private fb: FormBuilder){
    this.formulario = this.fb.group({
      'Lunes': [false, [Validators.required]],
      'LunesHorario': [],
      'Martes': [false, [Validators.required]],
      'MartesHorario': [],
      'Miercoles': [false, [Validators.required]],
      'MiercolesHorario': [],
      'Jueves': [false, [Validators.required]],
      'JuevesHorario': [],
      'Viernes': [false, [Validators.required]],
      'ViernesHorario': [],
      'Sabado': [false, [Validators.required]],
      'SabadoHorario': [],
    });
    this.formulario.controls['LunesHorario'].disable();
    this.formulario.controls['MartesHorario'].disable();
    this.formulario.controls['MiercolesHorario'].disable();
    this.formulario.controls['JuevesHorario'].disable();
    this.formulario.controls['ViernesHorario'].disable();
    this.formulario.controls['SabadoHorario'].disable();
  }

  
  setDay($event:any, dia:string){
    let control = dia + 'Horario';
    if($event){
      this.formulario.controls[control].enable();
      this.formulario.controls[control].setValidators(Validators.required)
      this.formulario.controls[control].updateValueAndValidity();
    }
    else {
      this.formulario.controls[control].reset();
      this.formulario.controls[control].disable();
    }

  }
  


  onSubmit(f: any) {
    console.info(f.value);


  }

}
