// ============================================================================
// Guard d'authentification (protection de routes)
// ----------------------------------------------------------------------------
// Un GUARD est un « videur » placé devant une route : Angular l'interroge
// AVANT d'activer la route. S'il renvoie true, la navigation continue ; s'il
// renvoie false (ou une redirection), la navigation est bloquée.
//
// Ici, on autorise l'accès uniquement si la couleur choisie est la bonne
// (e est présent dans le cookie). Sinon, on le redirige vers la page d'accueil'.
//
// Depuis Angular 15+, on privilégie les guards FONCTIONNELS (CanActivateFn) :
// une simple fonction, plus légère qu'une classe implémentant CanActivate.
// ============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PreferenceService } from '../services/preference-service';

export const preferenceGuard: CanActivateFn = (route, state) => {
  // On récupère cedont on a besoin par injection de dépendance
  const router = inject(Router);
  const preference = inject(PreferenceService);
  // On vérifie le critère et on retourne true si c'est ok
  if(preference.couleurPreferee()==='#800080'){
    return true;
  }
  //Sinon on reconstruit une nouvelle route pour rediriger l'utilisateur.
  return router.createUrlTree(['/welcome']);
};
