import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

// Ce guard améliore l'expérience (on n'affiche pas une page inutilisable) mais ne SÉCURISE rien :
// n'importe qui peut appeler l'API directement. La vraie protection est le middleware du backend.
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // On redirige vers le login en mémorisant la page demandée, pour y revenir après connexion.
  return router.createUrlTree(['/login'], { queryParams: { retour: state.url } });
};
