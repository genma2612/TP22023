import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario!: FormGroup;

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

  usuariosDePrueba = [
    { email: "865688654465ec@theeyeoftruth.com", pass: "111111", tipo: 'Paciente', imgURL: 'https://firebasestorage.googleapis.com/v0/b/tp2-2023.appspot.com/o/images%2FS5NOpYwwewd2XrUV1SqKSfB1MnG3%2Fimage1?alt=media&token=4899f9f6-96b9-42fe-9abc-6c9dba97e423&_gl=1*1xpmsoi*_ga*MjA2MDEwNjczNS4xNjk2NDIzMzgx*_ga_CW55HF8NVT*MTY5OTAzMzMzNy4yNC4xLjE2OTkwMzQ4ODkuNDYuMC4w' },
    { email: "d9967365446743@theeyeoftruth.com", pass: "111111", tipo: 'Paciente', imgURL: 'https://firebasestorage.googleapis.com/v0/b/tp2-2023.appspot.com/o/images%2F9rUwswDPIZSNAmmHBl9E3fwyPij1%2Fimage1?alt=media&token=8da141e9-52d0-4cab-a93b-f8ca40f61809&_gl=1*a7cmk4*_ga*MjA2MDEwNjczNS4xNjk2NDIzMzgx*_ga_CW55HF8NVT*MTY5OTAzMzMzNy4yNC4xLjE2OTkwMzQ5MjIuMTMuMC4w' },
    { email: "64dcf26544679c@beaconmessenger.com", pass: "111111", tipo: 'Paciente', imgURL: 'https://firebasestorage.googleapis.com/v0/b/tp2-2023.appspot.com/o/images%2F13tHHLfn3ghb2C9czhGcfPckdo53%2Fimage1?alt=media&token=2beeb199-3243-4bde-9cf4-3a9599405b59&_gl=1*wrcmrn*_ga*MjA2MDEwNjczNS4xNjk2NDIzMzgx*_ga_CW55HF8NVT*MTY5OTAzMzMzNy4yNC4xLjE2OTkwMzQ5NTAuNTguMC4w' },
    { email: "9e5a4065446880@lamasticots.com", pass: "111111", tipo: 'Especialista', imgURL: 'https://firebasestorage.googleapis.com/v0/b/tp2-2023.appspot.com/o/images%2FKzKVDN5T1oamungMkr5ANC6Rrwb2%2Fimage1?alt=media&token=81101fc3-601c-47d8-9642-3627df53751f&_gl=1*17xx49b*_ga*MjA2MDEwNjczNS4xNjk2NDIzMzgx*_ga_CW55HF8NVT*MTY5OTAzMzMzNy4yNC4xLjE2OTkwMzQ5NjQuNDQuMC4w' },
    { email: "48762465446906@beaconmessenger.com", pass: "111111", tipo: 'Especialista', imgURL: 'https://firebasestorage.googleapis.com/v0/b/tp2-2023.appspot.com/o/images%2FKutShjvlDAYxUn2u3Gxjk5ywURJ3%2Fimage1?alt=media&token=348d17c1-e25e-4c33-b264-05f88413dd38&_gl=1*lt7kkm*_ga*MjA2MDEwNjczNS4xNjk2NDIzMzgx*_ga_CW55HF8NVT*MTY5OTAzMzMzNy4yNC4xLjE2OTkwMzQ5OTIuMTYuMC4w' },
    { email: "56e3c065446359@lamasticots.com", pass: "111111", tipo: 'Administrador', imgURL: 'https://firebasestorage.googleapis.com/v0/b/tp2-2023.appspot.com/o/images%2FnyiPcYFO7vgXREzdYdQ8Deq726l2%2Fimage1?alt=media&token=bbc31e98-c8ec-40f2-a063-42a5718ac4c7&_gl=1*1dgaicg*_ga*MjA2MDEwNjczNS4xNjk2NDIzMzgx*_ga_CW55HF8NVT*MTY5OTAzMzMzNy4yNC4xLjE2OTkwMzQ5NzcuMzEuMC4w' }
  ];

  constructor(private userAuth: UserAuthService, private fb: FormBuilder, private ruteador: Router, private spinner: NgxSpinnerService) {
    this.formulario = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
    });
  }

  loguear(usuario: string, password: string) {
    this.spinner.show();
    this.userAuth.ingresar(usuario, password)
      .then((userCredential) => {
        if (userCredential.user.emailVerified) { //Verificar los usuarios de proeuba e implementar el guard para especialistas habilitados o inhabilitados por el administrador
          this.userAuth.traerUsuarioDeFirestore(userCredential.user).then(
            snapshot => {
              if(snapshot.data()!['rol'] == 'paciente' || snapshot.data()!['rol'] == 'administrador' || (snapshot.data()!['rol'] == 'especialista' && snapshot.data()!['tieneAcceso'])){
                this.userAuth.saveToLocalstorage(snapshot.data());
                this.ruteador.navigate(['home']);
                this.Toast.fire({
                  icon: 'success',
                  title: snapshot.data()!['nombre'] + ' ' + snapshot.data()!['apellido'] + ' logueado correctamente'
                })
                this.spinner.hide();
              }
              else{
                this.userAuth.salir().then(() => {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'El administrador no le brindó acceso'
                  })
                  this.spinner.hide();
                });
              }
              //this.userAuth.guardarInicioDeSesion(snapshot.data());
            }
          );
        }
        else {
          this.userAuth.salir().then(() => {
            this.Toast.fire({
              icon: 'error',
              title: 'El correo no está verificado.'
            })
            this.spinner.hide();
          });
        }
      })
      .catch(error => {
        console.info(error);
        this.Toast.fire({
          icon: 'error',
          title: this.firebaseErrors[error.code] || error.code
        })
        this.spinner.hide();
      });

  }

  setearCampos(email: string, password: string) {
    this.formulario.controls['email'].setValue(email);
    this.formulario.controls['password'].setValue(password);
  }


  onSubmit(f: any) {
    //console.info(f);
    this.loguear(f.email, f.password);
    //this.router.navigate(['welcome']);
  }

  ngOnInit(): void {
  }

}
