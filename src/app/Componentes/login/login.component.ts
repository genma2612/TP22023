import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuariosDePrueba = [
    {email:"asdf@gmail.com",pass:"111111"},
    {email:"raul.gonzalez@sarasa.com",pass:"123456"},
    {email:"felipe.gonzalez@sarasa.com",pass:"123456"},
    {email:"asdf2@gmail.com",pass:"111111"},
    {email:"raul.gonzalez@sarasa.com",pass:"123456"},
    {email:"felipe.gonzalez@sarasa.com",pass:"123456"}
];

  constructor(private userAuth:UserAuthService) { }

  loguear(usuario:string, password:string){
    console.info(usuario, password);
    this.userAuth.ingresar(usuario,password)
    .then(()=>console.info('ingreso correctamente'))
    .catch(error => console.info(error));

  }

  ngOnInit(): void {
  }

}
