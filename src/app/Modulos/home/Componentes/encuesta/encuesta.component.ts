import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {
  @Output() enviarDiagnostico = new EventEmitter<any>();
  formulario: FormGroup;

  codigosRango = ['No!', 'Si no me queda otra', 'No lo sé', 'Probablemente', 'Definitivamente!'];

  constructor(private fb: FormBuilder, private userAuth: UserAuthService, private ruteador:Router) {
    this.formulario = this.fb.group({
      'primeraVez': ['Si', [Validators.required]],
      'recomienda': [true],
      'volveria': [5, [Validators.required]],
      'puntaje': ['★★★★★', Validators.required],
      'comentario': ['Esta es una reseña...', Validators.required]
    });
  }

  guardar(form:any){
    this.enviarDiagnostico.emit(form);
  }

}
