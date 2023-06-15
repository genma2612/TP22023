import { UserAuthService } from './../../Servicios/user-auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Especialista, Paciente, Usuario } from 'src/app/Clases/interfaces';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  tipo: string | null;
  formulario!: FormGroup;
  image1!: File;
  image2!: File;

  constructor(private _Activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private auth: UserAuthService
  ) {
    this.tipo = this._Activatedroute.snapshot.paramMap.get("tipo");
  }

  ngOnInit(): void {
    this.setearValidaciones();
    this.setUserCategoryValidators();
  }

  setearValidaciones() {
    this.formulario = this.fb.group({
      'nombre': ['Jose', [Validators.required]],
      'apellido': ['Garcia', Validators.required],
      'edad': ['22', [Validators.required, Validators.min(18), Validators.max(99)]],
      'dni': ['22222222', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'obraSocial': ["222222", Validators.required],
      'numAfiliado': ["2222", [Validators.required, Validators.min(1000), Validators.max(9999)]],
      'especialidad': ["Cardiólogo", Validators.required],
      'especialidadPersonalizada': ["", Validators.required],
      'email': ['asdf@gmail.com', [Validators.required, Validators.email]],
      'pass': ['111111', Validators.required],
      'passConfirm': ['111111', Validators.required],
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
    const especialidadControl = this.formulario.get('especialidad');
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

  agregarOpcionPersonal() {
    const especialidadControl = this.formulario.get('especialidad');
    const especialidadPersonalizadaControl = this.formulario.get('especialidadPersonalizada');
    if (especialidadControl?.enabled) {
      especialidadControl?.disable()
      especialidadPersonalizadaControl?.enable();
    }
    else {
      especialidadControl?.enable();
      especialidadPersonalizadaControl?.disable();
    }
    especialidadControl?.updateValueAndValidity();
    especialidadPersonalizadaControl?.updateValueAndValidity();
  }

  /* Opcion de arriba no utiliza observable
  opcionDelMenuOPersonalizada() {
    const especialidadControl = this.formulario.get('especialidad');
    const especialidadPersonalizadaControl = this.formulario.get('especialidadPersonalizada');
    especialidadPersonalizadaControl?.disable();
    this.formulario.get('check')?.valueChanges
      .subscribe(value => {
        if (value) {
          // enable the input when new value is true
          especialidadControl?.disable();
          especialidadPersonalizadaControl?.enable();
        } else {
          // disable the input when new value is false
          especialidadControl?.enable();
          especialidadPersonalizadaControl?.disable();
        }
        especialidadControl?.updateValueAndValidity();
        especialidadPersonalizadaControl?.updateValueAndValidity();
      });
  }*/

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
    let usuario: Paciente | Especialista;
    if (tipo == 'especialista') {
      if (form.especialidad == undefined) {
        form.especialidad = form.especialidadPersonalizada;
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
        form.especialidad,
        false);
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
        form.numAfiliado);
    }

    delete form['passConfirm'];

    this.auth.registrar({ correo: form.email, password: form.pass })
      .then(
        (userCredential) => {
          usuario.uid = userCredential.user.uid;

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

              }))

          //
          //this.auth.guardarUsuarioEnFirestore(usuario)
          //  .then(() => console.log('Registrado y guardado en Firebase'))
          //  .catch(error => console.info(error))
        }
      )
      .catch(error => console.info(error));

    //let teset: Especialista = form; // Tipificar objeto segun interfaces
    //this.auth.SignUp(form, tipo)

  }

}
