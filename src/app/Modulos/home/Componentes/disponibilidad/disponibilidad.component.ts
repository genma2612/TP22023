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

  constructor(private fb: FormBuilder){
    this.formulario = this.fb.group({
      'Lunes': [false, [Validators.required]],
      'Martes': [false, [Validators.required]],
      'Miercoles': [false, [Validators.required]],
      'Jueves': [false, [Validators.required]],
      'Viernes': [false, [Validators.required]],
      'Sabado': [false, [Validators.required]],
    });
  }

  setDay($event:any){
    console.info($event);
    this.isEnabled = $event.returnValue;
  }

  onSubmit(f: any) {
    console.info(f);
    console.info('asdasd');
    //this.router.navigate(['welcome']);
    //this.formulario.controls['email'].setValue(email);
    //this.formulario.controls['password'].setValue(password);
  }

}
