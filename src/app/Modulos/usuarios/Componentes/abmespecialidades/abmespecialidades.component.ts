import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Especialista, Paciente, Usuario } from 'src/app/Clases/interfaces';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import * as stringRandom from 'string-random';

@Component({
  selector: 'app-abmespecialidades',
  templateUrl: './abmespecialidades.component.html',
  styleUrls: ['./abmespecialidades.component.css']
})
export class ABMespecialidadesComponent implements OnInit, OnDestroy {

  $observableEspecialidades: Subscription = new Subscription();

  formulario!: FormGroup;
  image1!: File;
  especialidades: any;
  especialidadSeleccionada: any;
  accion: string = 'Crear';
  activarForm: boolean = false;
  editar = false;

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
    if (this.accion == 'Crear')
      this.crearEspecialidad(f);
    else {
      this.modificarEspecialidadElegida(f);
    }
  }

  crearEspecialidad(form: any) {
    let randomstring = stringRandom(20);
    let obj = { nombre: form.nombreEspecialidad, imagen: '', estaHabilitada: true, uid: randomstring };
    this.spinner.show();
    this.auth.subirImagenEspecialidad(this.image1, obj.uid, "imageUrl").then(
      () => this.auth.traerImagenEspecialidad(obj.uid, "imageUrl").then(
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

  modificarEspecialidadElegida(f:any){
    if (this.image1 == undefined) {
      this.auth.actualizarEspecialidad(this.especialidadSeleccionada, f).then(
        () => console.info('se actualizó')
      )
    }
    else {
      let imagen = '';
      if (f.nombreEspecialidad == this.especialidadSeleccionada.nombre) { //solo subo la imagen
        this.auth.subirImagenEspecialidad(this.image1, this.especialidadSeleccionada.uid, "imageUrl").then(
          () => this.auth.traerImagenEspecialidad(this.especialidadSeleccionada.uid, "imageUrl").then(
            response => {
              imagen = response;
              this.auth.actualizarImagenEspecialidad(this.especialidadSeleccionada, imagen).then(
                () => this.formulario.controls['image1'].setValue(null)
              )
            }
          )
        );
      }
      else {
        this.auth.actualizarEspecialidad(this.especialidadSeleccionada, f).then(
          () => {
            this.auth.subirImagenEspecialidad(this.image1, this.especialidadSeleccionada.uid, "imageUrl").then(
              () => this.auth.traerImagenEspecialidad(this.especialidadSeleccionada.uid, "imageUrl").then(
                response => {
                  imagen = response;
                  this.auth.actualizarImagenEspecialidad(this.especialidadSeleccionada, imagen).then(
                    () => this.formulario.controls['image1'].setValue(null)
                  )
                }
              )
            );
          }
        )
      }
      this.cancelarCreacion();
    }
  }

  modificarHabilitacion(item:any){
    this.auth.cambiarHAbilitacionEspecialidad(item.uid, !item.estaHabilitada).then(
      () => console.info('se actualizó')
    )
  }

  activarCreacion() {
    this.activarForm = true;
    this.accion = 'Crear';
    this.formulario.controls['nombreEspecialidad'].setValidators(Validators.required);
    this.formulario.controls['nombreEspecialidad'].updateValueAndValidity();
    this.formulario.controls['image1'].setValidators(Validators.required);
    this.formulario.controls['image1'].updateValueAndValidity();
  }

  cancelarCreacion() {
    this.activarForm = false;
    this.formulario.reset();
  }

  modificarEspecialidad(item: any) {
    this.activarForm = true;
    this.accion = 'Modificar';
    this.especialidadSeleccionada = item;
    this.formulario.controls['nombreEspecialidad'].setValue(item.nombre);
    this.formulario.controls['image1'].clearValidators();
    this.formulario.controls['image1'].updateValueAndValidity();
  }



}
