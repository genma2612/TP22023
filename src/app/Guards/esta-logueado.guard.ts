import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';


export const estaLogueadoGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let router: Router = inject(Router);
  if (localStorage.getItem('usuarioActual') != null)
    return true
  else {
    router.navigateByUrl('welcome');
    return false;
  }
};
