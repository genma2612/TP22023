import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cargar-historia-clinica',
  templateUrl: './cargar-historia-clinica.component.html',
  styleUrls: ['./cargar-historia-clinica.component.css']
})
export class CargarHistoriaClinicaComponent implements OnInit {
  @Output() enviarDiagnostico = new EventEmitter<any>();
  formulario: FormGroup;


  constructor(private auth: UserAuthService, private fb: FormBuilder, private spinner: NgxSpinnerService){
    this.formulario = this.fb.group({
      diagnostico: ["Este es el diagnóstico que recibió el paciente", Validators.required],
      altura: [144, [Validators.required, Validators.min(20), Validators.max(220)]],
      peso: [58, [Validators.required, Validators.min(1), Validators.max(300)]],
      temperatura: [36, [Validators.required, Validators.min(35), Validators.max(40)]],
      presion: ['120/80', [Validators.required, Validators.pattern(/^\b(29[0-9]|2[0-9][0-9]|[01]?[0-9][0-9]?)\/(29[0-9]|2[0-9][0-9]|[01]?[0-9][0-9]?)$/)]],
      datosDinamicos: this.fb.array([])
    });
  }

  get arrayDinamico() {
    return this.formulario.get('datosDinamicos') as FormArray;
  }

  agregarDato(){
    if(this.arrayDinamico.length < 3){
      const grupo = this.fb.group({
        clave: [null, Validators.required],
        valor: [null, Validators.required]
      })
      this.arrayDinamico.push(grupo);
    }
  }

  borrarDato(i: number) {
    this.arrayDinamico.removeAt(i);
 }



  ngOnInit(): void {
  }

  onSubmit(formulario:any){
    this.enviarDiagnostico.emit(formulario);
  }

}
