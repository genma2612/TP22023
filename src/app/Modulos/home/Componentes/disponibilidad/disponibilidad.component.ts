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
  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private fb: FormBuilder){
    this.formulario = this.fb.group({
      'Lunes': [false, [Validators.required]],
      'Martes': [false, [Validators.required]],
      'Miercoles': [false, [Validators.required]],
      'Jueves': [false, [Validators.required]],
      'Viernes': [false, [Validators.required]],
      'Sábado': [false, [Validators.required]],
    });
  }

  setDay($event:any){
    console.info($event);
    this.isEnabled = $event.returnValue;
  }

  onSubmit(f: any) {
    console.info(f);
  }

}
