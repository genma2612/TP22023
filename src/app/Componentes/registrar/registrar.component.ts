import { UserAuthService } from './../../Servicios/user-auth.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Especialista, Paciente, Usuario } from 'src/app/Clases/interfaces';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import * as stringRandom from 'string-random';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit, OnDestroy {
  tipo: string | null;
  formulario!: FormGroup;
  image1!: File;
  image2!: File; 
  //especialidades = ['Cardiología', 'Traumatología', 'Pediatra', 'Odontología', 'Dermatología'];
  especialidades:any;

  $observableEspecialidades:Subscription = new Subscription();
  llaveDeSitio = '6Lep6wcpAAAAAN_tm_AC_JFqL0Zgrae088nL8k-q';

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

  firebaseErrors:any = {
    'auth/user-not-found': 'El correo ingresado no se encuentra registrado',
    'auth/wrong-password': 'Contraseña incorrecta'
  };

  constructor(private _Activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private auth: UserAuthService,
    private spinner: NgxSpinnerService
  ) {
    this.tipo = this._Activatedroute.snapshot.paramMap.get("tipo");
  }

  ngOnDestroy(): void {
    this.$observableEspecialidades.unsubscribe();
  }


  ngOnInit(): void {
    this.setearValidaciones();
    this.setUserCategoryValidators();
    this.$observableEspecialidades = this.auth.traerColeccionOrdenada('especialidades', 'nombre').subscribe(
      response => this.especialidades = response
    )
  }

  setearValidaciones() {
    this.formulario = this.fb.group({
      'nombre': ['', [Validators.required]],
      'apellido': ['', Validators.required],
      'edad': ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      'sexo': ['', [Validators.required]],
      'dni': ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'obraSocial': ["", Validators.required],
      'numAfiliado': ["", [Validators.required, Validators.min(1000), Validators.max(9999)]],
      'especialidades': this.fb.array([], [Validators.required]),
      'especialidadPersonalizada': ["", Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'pass': ['', Validators.required],
      'passConfirm': ['', Validators.required],
      'image1': [null, [Validators.required]],
      'image2': [null, [Validators.required]],
      'captcha' : [null, Validators.required]
    });
  }

  actualizarArchivo($event: any, control: string) {
    if (control == 'image1') {
      this.image1 = $event.target.files[0];
    }
    else {
      this.image2 = $event.target.files[0];
    }
  }

  //Esta función agrega o quita validaciones según el registro sea del tipo Paciente o Especialista
  setUserCategoryValidators() {
    const obraSocialControl = this.formulario.get('obraSocial');
    const numAfiliadoControl = this.formulario.get('numAfiliado');
    const especialidadControl = this.formulario.get('especialidades');
    const especialidadPersonalizadaControl = this.formulario.get('especialidadPersonalizada');
    const image2 = this.formulario.get('image2');
    especialidadPersonalizadaControl?.disable(); // Siempre la deshabilito por defecto, sea paciente o especialista
    especialidadPersonalizadaControl?.updateValueAndValidity();
    if (this.tipo === 'paciente') { //Si es paciente, deshabilito los campos del especialista.
      especialidadControl?.disable();
      especialidadControl?.updateValueAndValidity();
    }
    if (this.tipo === 'especialista') { //Si es especialista, deshabilito los campos del paciente.
      obraSocialControl?.disable();
      obraSocialControl?.updateValueAndValidity();
      numAfiliadoControl?.disable();
      numAfiliadoControl?.updateValueAndValidity();
      image2?.disable();
      image2?.updateValueAndValidity();
    }
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.formulario.get('especialidades') as FormArray;
    checkArray.markAsTouched();
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  agregarOpcionPersonal() {
    const especialidades = this.formulario.get('especialidades');
    const especialidadPersonalizadaControl = this.formulario.get('especialidadPersonalizada');
    if (especialidadPersonalizadaControl?.disabled) {
      especialidadPersonalizadaControl?.enable()
      especialidades?.clearValidators();
      especialidades?.updateValueAndValidity();
    }
    else {
      especialidadPersonalizadaControl?.disable();
      especialidades?.setValidators([Validators.required]);
      especialidades?.updateValueAndValidity();
    }
    especialidadPersonalizadaControl?.updateValueAndValidity();
  }


  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors(null);
    } else {
      this.confirm_password.setErrors({ mismatch: true });
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


  // getting the form control elements
  get password(): AbstractControl {
    return this.formulario.controls['pass'];
  }

  get confirm_password(): AbstractControl {
    return this.formulario.controls['passConfirm'];
  }





  onSubmit(f: any) {
    //console.info(f);
    this.crearUsuario(f, this.tipo!);
  }

  crearUsuario(form: any, tipo: string) {
    let usuario: Paciente | Especialista;
    let obj = {}
    let guardaEspecialidad = false;
    if (tipo == 'especialista') {
      const especialidadPersonalizadaControl = this.formulario.get('especialidadPersonalizada');
      if (especialidadPersonalizadaControl?.enabled) {
        guardaEspecialidad = true;
        obj = { nombre:especialidadPersonalizadaControl.value , imagen:'https://firebasestorage.googleapis.com/v0/b/tp2-2023.appspot.com/o/especialidades%2Fdefault%2Fdefault.png?alt=media&token=b3be2418-0efc-4849-acef-6a0654c95870', estaHabilitada:true,uid:stringRandom(20)};
        form.especialidades.push(especialidadPersonalizadaControl.value);
        delete form['especialidadPersonalizada']
      }
      usuario = new Especialista(
        '',
        'especialista',
        form.email,
        form.nombre,
        form.apellido,
        form.sexo,
        form.edad,
        form.dni,
        '','',
        form.especialidades,
        { Lunes:
          {
            nombreDia: "Lunes",
            duracionDelDia: 30,
            codDia: 1,
            especialidadDelDia: form.especialidades[0],
            rango: {
              horaInicio : 0,
              horaFin : 0,
            }
          },
          Martes :
          {
            nombreDia: "Martes",
            duracionDelDia: 30,
            codDia: 2,
            especialidadDelDia: form.especialidades[0],
            rango: {
              horaInicio : 0,
              horaFin : 0,
            }
          },
          Miercoles :
          {
            nombreDia: "Miercoles",
            duracionDelDia: 30,
            codDia: 3,
            especialidadDelDia: form.especialidades[0],
            rango: {
              horaInicio : 0,
              horaFin : 0,
            }
          },
          Jueves :
          {
            nombreDia: "Jueves",
            duracionDelDia: 30,
            codDia: 4,
            especialidadDelDia: form.especialidades[0],
            rango: {
              horaInicio : 0,
              horaFin : 0,
            }
          },
          Viernes : 
          {
            nombreDia: "Viernes",
            duracionDelDia: 30,
            codDia: 5,
            especialidadDelDia: form.especialidades[0],
            rango: {
              horaInicio : 0,
              horaFin : 0,
            }
          },
          Sabado : 
          {
            nombreDia: "Sabado",
            duracionDelDia: 30,
            codDia: 6,
            especialidadDelDia: form.especialidades[0],
            rango: {
              horaInicio : 0,
              horaFin : 0,
            }
          }
        },
        false
        );
    }
    else if (tipo == 'paciente') {
      usuario = new Paciente(
        '',
        'paciente',
        form.email,
        form.nombre,
        form.apellido,
        form.sexo,
        form.edad,
        form.dni,
        '',
        '',
        form.obraSocial,
        form.numAfiliado
        );
    }

    delete form['passConfirm'];
    this.spinner.show();
    this.auth.registrar({ correo: form.email, password: form.pass })
      .then(
        (userCredential) => {
          usuario.uid = userCredential.user.uid;
          this.auth.enviarEmailDeVerificacion(userCredential.user).then(()=>
          console.info('se envió el mail'));
          //


          this.auth.subirImagenes(this.image1, userCredential.user.uid, "image1").then(
            () => this.auth.traerImagen(userCredential.user.uid, "image1").then(
              response => {
                usuario.imagenUno = response;
                if (usuario instanceof Paciente) {
                  this.auth.subirImagenes(this.image2, userCredential.user.uid, 'image2').then(
                    () => this.auth.traerImagen(userCredential.user.uid, 'image2').then(
                      response => {
                        usuario.imagenDos = response;
                        this.auth.guardarUsuarioEnFirestore(usuario)
                          .then(() => console.log('Registrado y guardado en Firebase'))
                          .catch(error => console.info(error))
                      }))
                }
                else {
                  this.auth.guardarUsuarioEnFirestore(usuario)
                    .then(() => {
                      if(guardaEspecialidad){
                        this.auth.guardarEspecialidad(obj).then(
                          () => console.log('Registrado y guardado en Firebase con su especialidad')
                        )
                      }
                      else{
                        console.log('Especialista registrado y guardado en Firebase');
                      }
                    } 
                    )
                    .catch(error => console.info(error))
                }
                this.Toast.fire({
                  icon: 'success',
                  title:' Usuario creado correctamente. Revise su casilla de mail'
                })
                this.router.navigate(['lobby']);
                this.spinner.hide();
              }))
        }
      )
      .catch(error => {
        this.Toast.fire({
          icon: 'error',
          title: this.firebaseErrors[error.code] || error.code
        });
        console.info(error);
        this.spinner.hide();
      });
  }


  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

}
