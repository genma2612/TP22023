import { CanActivateFn } from '@angular/router';

export const esAdminGuard: CanActivateFn = (route, state) => {
  return JSON.parse(localStorage.getItem('usuarioActual')!).rol == 'administrador';
};
