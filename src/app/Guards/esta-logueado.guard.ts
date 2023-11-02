import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const estaLogueadoGuard: CanActivateFn = (route, state) => {
  return localStorage.getItem('usuarioActual') != null;
  //return true;
};
