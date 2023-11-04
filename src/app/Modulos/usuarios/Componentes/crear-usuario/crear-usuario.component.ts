import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Especialista, Paciente, Usuario } from 'src/app/Clases/interfaces';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  @Input() tipo:string = 'administrador';
  @Output() cerrarModal = new EventEmitter<boolean>;

  formulario!: FormGroup;
  image1!: File;
  image2!: File;
  especialidades = ['Cardiólogo', 'Traumatólogo', 'Pediatra', 'Odontólogo'];

  firebaseErrors:any = {
    'auth/user-not-found': 'El correo ingresado no se encuentra registrado',
    'auth/wrong-password': 'Contraseña incorrecta'
  };

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


  constructor(private _Activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private auth: UserAuthService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.setearValidaciones();
    this.setUserCategoryValidators();
  }

  ngOnChanges(changes: SimpleChanges){
    this.setearValidaciones();
    this.setUserCategoryValidators();
  }

  setearValidaciones() {
    this.formulario = this.fb.group({
      'nombre': ['', [Validators.required]],
      'apellido': ['', Validators.required],
      'edad': ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      'dni': ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'obraSocial': ["", Validators.required],
      'numAfiliado': ["", [Validators.required, Validators.min(1000), Validators.max(9999)]],
      'especialidades': this.fb.array([], [Validators.required]),
      'especialidadPersonalizada': ["", Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'pass': ['', Validators.required],
      'passConfirm': ['', Validators.required],
      'image1': [null, [Validators.required]],
      'image2': [null, [Validators.required]]
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
    if (this.tipo === 'paciente' || this.tipo === 'administrador') { //Si es paciente, deshabilito los campos del especialista.
      especialidadControl?.disable();
      especialidadControl?.updateValueAndValidity();
    }
    if (this.tipo === 'especialista' || this.tipo === 'administrador') { //Si es especialista, deshabilito los campos del paciente.
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
    this.crearUsuario(f, this.tipo!);
    //this.router.navigate(['welcome']);
  }

  crearUsuario(form: any, tipo: string) {
    let usuario:Usuario|Paciente|Especialista;
    if (tipo == 'especialista') {
      const especialidadPersonalizadaControl = this.formulario.get('especialidadPersonalizada');
      if (especialidadPersonalizadaControl?.enabled) {
        form.especialidades.push(especialidadPersonalizadaControl.value);
        delete form['especialidadPersonalizada']
      }
      usuario = new Especialista(
        '',
        'especialista',
        form.email,
        form.nombre,
        form.apellido,
        form.edad,
        form.dni,
        '','',
        form.especialidades,
        [
          {
            "dia": "Lunes",
            "horario": "no"
          },
          {
            "dia": "Martes",
            "horario": "no"
          },
          {
            "dia": "Miercoles",
            "horario": "no"
          },
          {
            "dia": "Jueves",
            "horario": "no"
          },
          {
            "dia": "Viernes",
            "horario": "no"
          },
          {
            "dia": "Sabado",
            "horario": "no"
          }
        ],
        30,
        true,
        []);
    }
    else if (tipo == 'paciente') {
      usuario = new Paciente(
        '', 
        'paciente', 
        form.email, 
        form.nombre, 
        form.apellido,
        form.edad,
        form.dni,
        '',
        '',
        form.obraSocial,
        form.numAfiliado,
        []);
    }
    else{
      usuario = new Usuario(
        '', 
        'administrador', 
        form.email, 
        form.nombre, 
        form.apellido,
        form.edad,
        form.dni,
        '','');
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
                    .then(() => console.log('Registrado y guardado en Firebase'))
                    .catch(error => console.info(error))
                }
                this.Toast.fire({
                  icon: 'success',
                  title:' Usuario creado correctamente'
                })
                this.formulario.reset();
                this.spinner.hide();
                this.cerrarModal.emit(true);
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

}
