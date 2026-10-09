# Les Guards (gardes de route) en Angular

> **Prérequis** : Angular 20+, notions de routing (`app.routes.ts`, `RouterOutlet`), `inject()`.
> **Objectif** : Comprendre le rôle des guards, connaître leurs différents types, et savoir écrire des **guards fonctionnels** (l'approche moderne) pour protéger une application.

---

## 1. Pourquoi des guards ?

Le routeur d'Angular affiche des composants selon l'URL. Mais on veut souvent **contrôler l'accès** :

- Empêcher un utilisateur non connecté d'accéder à `/admin`.
- Demander confirmation avant de quitter un formulaire non enregistré.
- Charger des données **avant** d'afficher une page.
- Éviter de télécharger un module réservé à certains rôles.

Un **guard** est une fonction que le routeur exécute **avant** (ou pendant) une navigation. Selon ce qu'elle renvoie, la navigation est **autorisée**, **bloquée** ou **redirigée**.

> **Règle directrice** : un guard décide *si* et *comment* une navigation a lieu. Il ne doit pas contenir de logique métier lourde — juste une décision.

---

## 2. Les valeurs de retour possibles

Un guard renvoie l'un des types suivants (directement, ou via une `Promise` / un `Observable`) :

| Valeur retournée | Effet |
|------------------|-------|
| `true` | Navigation **autorisée** |
| `false` | Navigation **bloquée** |
| `UrlTree` (via `router.createUrlTree` ou `redirectTo`) | **Redirection** vers une autre route |

---

## 3. Les 4 types de guards

| Guard | Type de fonction | Rôle |
|-------|------------------|------|
| **CanActivate** | `CanActivateFn` | Peut-on **entrer** sur cette route ? |
| **CanActivateChild** | `CanActivateChildFn` | Peut-on entrer sur ses **routes enfants** ? |
| **CanDeactivate** | `CanDeactivateFn<T>` | Peut-on **quitter** cette route ? |
| **CanMatch** | `CanMatchFn` | Cette route doit-elle être **prise en compte** (utile pour le lazy loading et les rôles) ? |
| **Resolve** | `ResolveFn<T>` | **Précharger** des données avant l'affichage |

> **Note** : depuis Angular 15, les guards **basés sur des classes** (`CanActivate` en tant qu'interface) sont **dépréciés**. On écrit désormais des **guards fonctionnels**.

---

## 4. Écrire un guard fonctionnel : `CanActivateFn`

Un guard fonctionnel est une **simple fonction**. On y utilise `inject()` pour récupérer nos services (le `constructor` n'existe pas ici).

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estConnecte()) {
    return true; // accès autorisé
  }

  // Sinon : on redirige vers la page de connexion en mémorisant l'URL cible.
  return router.createUrlTree(['/login'], {
    queryParams: { retour: state.url },
  });
};
```

On l'attache à une route via la propriété `canActivate` :

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard], // ← le guard protège cette route
  },
];
```

---

## 5. `CanDeactivate` : confirmer avant de quitter

Très utile pour **prévenir la perte de données** d'un formulaire.

```typescript
// unsaved-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';

// On impose que le composant expose une méthode `peutQuitter()`.
export interface FormulaireQuittable {
  peutQuitter: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<FormulaireQuittable> = (
  composant,
) => {
  if (composant.peutQuitter()) {
    return true;
  }
  return confirm('Des modifications ne sont pas enregistrées. Quitter quand même ?');
};
```

Dans le composant :

```typescript
export class EditionProfil implements FormulaireQuittable {
  private modifie = false;
  peutQuitter = () => !this.modifie;
}
```

---

## 6. `CanMatch` : guard + lazy loading + rôles

`CanMatch` s'exécute **avant** même de charger le composant/module. Si plusieurs routes ont le même chemin, il permet d'en choisir une selon le rôle.

```typescript
// role.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from './auth.service';

export const estAdminGuard: CanMatchFn = () => {
  return inject(AuthService).aLeRole('admin');
};
```

```typescript
{
  path: 'tableau-de-bord',
  canMatch: [estAdminGuard],
  loadComponent: () => import('./admin-board').then(m => m.AdminBoard),
}
```

> **Avantage** : si le guard renvoie `false`, Angular ne télécharge **même pas** le code du composant.

---

## 7. `ResolveFn` : précharger des données

Un *resolver* récupère des données **avant** l'affichage de la page, évitant un écran vide qui se remplit après coup.

```typescript
// produit.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProduitService } from './produit.service';

export const produitResolver: ResolveFn<Produit> = (route) => {
  const id = route.paramMap.get('id')!;
  return inject(ProduitService).getById(id); // peut renvoyer un Observable
};
```

```typescript
{
  path: 'produit/:id',
  component: ProduitDetail,
  resolve: { produit: produitResolver },
}
```

Dans le composant, on lit la donnée déjà résolue :

```typescript
private route = inject(ActivatedRoute);
produit = this.route.snapshot.data['produit'];
```

---

## 8. Bonnes pratiques

- **Toujours utiliser des guards fonctionnels** (les classes sont dépréciées).
- **Un guard = une responsabilité** : `authGuard`, `estAdminGuard`, `unsavedChangesGuard`...
- **Rediriger avec un `UrlTree`** plutôt que d'appeler `router.navigate()` puis renvoyer `false`.
- **Préférer `CanMatch` à `CanActivate`** pour protéger du code *lazy-loaded* (on évite de le télécharger).
- Garder les guards **rapides** : ils s'exécutent à chaque navigation.

---

## 9. Récapitulatif

| Besoin | Guard |
|--------|-------|
| Bloquer l'accès à une page | `CanActivateFn` |
| Bloquer ses routes enfants | `CanActivateChildFn` |
| Confirmer avant de quitter | `CanDeactivateFn` |
| Choisir/protéger une route *lazy* selon le rôle | `CanMatchFn` |
| Charger des données avant affichage | `ResolveFn` |

Les guards sont la **porte d'entrée** de vos routes : ils garantissent qu'un utilisateur voit **la bonne page, avec les bonnes données, s'il en a le droit**.
