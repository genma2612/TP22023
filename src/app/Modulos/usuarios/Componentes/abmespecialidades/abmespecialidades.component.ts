import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Especialista, Paciente, Usuario } from 'src/app/Clases/interfaces';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-abmespecialidades',
  templateUrl: './abmespecialidades.component.html',
  styleUrls: ['./abmespecialidades.component.css']
})
export class ABMespecialidadesComponent implements OnInit, OnDestroy {

  $observableEspecialidades:Subscription = new Subscription();

  formulario!: FormGroup;
  image1!: File;
  especialidades:any;

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });


  constructor(
    private fb: FormBuilder,
    private auth: UserAuthService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnDestroy(): void {
    this.$observableEspecialidades.unsubscribe();
  }

  ngOnInit(): void {
    this.$observableEspecialidades = this.auth.traerColeccionOrdenada('especialidades', 'nombre').subscribe(
      response => this.especialidades = response
    )
    this.setearValidaciones();
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  setearValidaciones() {
    this.formulario = this.fb.group({
      'nombreEspecialidad': ['', [Validators.required]],
      'image1': [null, [Validators.required]]
    });
  }

  actualizarArchivo($event: any, control: string) {
    if (control == 'image1') {
      this.image1 = $event.target.files[0];
    }

  }

  requiredFileType(type: string) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }
        return null;
      }
      return null;
    };
  }



  onSubmit(f: any) {
    this.crearEspecialidad(f);
  }

  crearEspecialidad(form: any) {
    let obj = { nombre:form.nombreEspecialidad, imagen:'', estaHabilidata:true,uid:''}
    this.spinner.show();
    this.auth.subirImagenEspecialidad(this.image1, form.nombreEspecialidad, "imageUrl").then(
      () => this.auth.traerImagenEspecialidad(form.nombreEspecialidad, "imageUrl").then(
        response => {
          obj.imagen = response;
          this.auth.guardarEspecialidad(obj).then(
            () => this.spinner.hide()
          )
        }
      )
        .catch(error => {
          this.Toast.fire({
            icon: 'error',
            title: error.code
          });
          console.info(error);
          this.spinner.hide();
        }));

  }

}
