# HttpClient et les Interceptors en Angular

> **Prérequis** : Angular 20+, composants standalone, `inject()`, notions de base sur les Observables (RxJS).
> **Objectif** : Savoir configurer `HttpClient`, effectuer des requêtes vers une API REST, et centraliser des comportements transverses (authentification, gestion d'erreurs) grâce aux **interceptors fonctionnels**.
> **Application concrète** : l'intercepteur d'authentification de ce projet est décrit en détail dans [13_Authentification_JWT.md](13_Authentification_JWT.md).

---

## 1. À quoi sert HttpClient ?

Une application front a besoin de **dialoguer avec un serveur** : récupérer des produits, envoyer un formulaire, se connecter... `HttpClient` est le service d'Angular dédié à ces échanges HTTP. Il apporte :

- Une API simple : `get`, `post`, `put`, `delete`, `patch`.
- Le **typage** des réponses (`get<IProduct[]>(...)`).
- La gestion des **Observables** (annulation, retry, transformation).
- Un système d'**interceptors** pour factoriser la logique commune.

---

## 2. Configuration (approche standalone)

Pas de `HttpClientModule` : on **fournit** `HttpClient` dans la configuration de l'application. C'est aussi ici qu'on enregistre les interceptors.

```typescript
// app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Les intercepteurs s'exécutent dans l'ordre du tableau.
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

> **Piège classique** : sans `withInterceptors([...])`, l'intercepteur existe mais **n'est jamais appelé**. Aucune erreur, simplement aucun effet.

---

## 3. Effectuer des requêtes

On injecte `HttpClient` dans un **service**, puis on appelle la méthode correspondant au verbe HTTP. Exemple tiré du projet (`product-service.ts`) :

```typescript
@Service()
export class ProductService {

    private http = inject(HttpClient);
    private readonly apiUrl = "http://localhost:3000";

    getAllProducts$(): Observable<IProduct[]>{
        return this.http.get<IProduct[]>(this.apiUrl + '/products');
    }

    createProduct$(productToCreate: Omit<IProduct, 'id'>): Observable<IProduct>{
        return this.http.post<IProduct>(this.apiUrl + '/products', productToCreate);
    }

    deleteProductById$(id: string): Observable<{message: string}>{
        return this.http.delete<{message: string}>(this.apiUrl + "/products/" + id);
    }
}
```

> **Important** : un Observable ne fait **rien** tant que personne ne s'y **abonne** (`.subscribe()`), ou tant qu'on ne le passe pas à un `| async` dans le template.

```typescript
this.productService.getAllProducts$().subscribe({
  next: (produits) => (this.dataSource.data = produits),
  error: (err) => this.error.set(`Erreur du backEnd: ${err.message || err}`),
});
```

---

## 4. Passer des paramètres et des en-têtes

```typescript
import { HttpParams, HttpHeaders } from '@angular/common/http';

rechercher(terme: string) {
  const params = new HttpParams().set('q', terme).set('limite', 20);
  const headers = new HttpHeaders().set('Accept', 'application/json');

  return this.http.get<IProduct[]>(this.apiUrl + '/products', { params, headers });
}
// → GET .../products?q=terme&limite=20
```

---

## 5. Les Interceptors : la logique transverse

Un **interceptor** est une fonction qui **s'intercale** entre votre appel et le serveur. Chaque requête (et chaque réponse) passe par lui. C'est l'endroit idéal pour tout ce qui doit s'appliquer **partout** :

- Ajouter un **token d'authentification**.
- Gérer les **erreurs** de façon centralisée (ex. `401`).
- **Journaliser** les requêtes.
- Afficher un **indicateur de chargement** global.

```
Composant → ProductService → HttpClient → [Intercepteur 1] → [Intercepteur 2] → Serveur
                                              ↑ ajoute le token   ↑ log
```

**Sans** intercepteur, il faudrait écrire l'en-tête `Authorization` dans **chaque** méthode de **chaque** service (et en oublier). **Avec**, on l'écrit une fois, et les services restent inchangés.

### a) Intercepteur d'authentification (celui du projet)

```typescript
// interceptors/auth-interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = auth.getToken();

    // Pas de token, ou requête vers un autre serveur : on ne transmet surtout pas notre token à un tiers.
    if (!token || !req.url.startsWith(API_URL)) {
        return next(req);
    }

    // Une requête est IMMUABLE : on en fabrique une copie qui porte l'en-tête.
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next(authReq);
};
```

Points clés :

- **`HttpRequest` est immuable** : on ne la modifie jamais, on utilise `req.clone({ ... })`.
- **`inject()` fonctionne** dans un intercepteur fonctionnel (il s'exécute dans un contexte d'injection).
- **`next(req)`** passe la main au maillon suivant ; il renvoie un Observable de la réponse.
- **Ne jamais envoyer le token à un domaine tiers** : on vérifie que l'URL commence par celle de notre API.

### b) Intercepteur de gestion d'erreurs

Pour réagir à la **réponse**, on agit sur l'Observable renvoyé par `next(...)` avec les opérateurs RxJS :

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((erreur: HttpErrorResponse) => {
      if (erreur.status === 401) {
        // session expirée : déconnecter, rediriger...
      } else if (erreur.status >= 500) {
        // afficher un message « erreur serveur »
      }
      // On relance l'erreur pour que l'appelant (le .subscribe({ error })) puisse aussi la gérer.
      return throwError(() => erreur);
    }),
  );
};
```

Dans ce projet, la gestion du `401` (« token refusé : on se déconnecte et on retourne au login ») est directement intégrée à `authInterceptor`, car elle est indissociable de l'authentification.

### c) Ordre d'exécution

Les interceptors s'exécutent **dans l'ordre du tableau** pour la requête, et dans l'ordre **inverse** pour la réponse.

```typescript
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
//  requête :  auth → error → réseau
//  réponse :  réseau → error → auth
```

---

## 6. Alternative moderne : `httpResource` (signals)

Angular propose aussi une API **réactive** basée sur les signals pour **lire** des données, sans gérer manuellement l'abonnement.

```typescript
import { httpResource } from '@angular/common/http';

export class ProduitDetail {
  id = input.required<string>();
  // La requête se relance automatiquement si l'id (signal) change.
  produit = httpResource<IProduct>(() => `http://localhost:3000/products/${this.id()}`);
}
```

```html
@if (produit.isLoading()) {
  <p>Chargement…</p>
} @else if (produit.value(); as p) {
  <h2>{{ p.name }}</h2>
}
```

Les requêtes passent aussi par les intercepteurs enregistrés.

---

## 7. Tester un intercepteur

On vérifie l'en-tête réellement envoyé avec `HttpTestingController` (voir `auth-interceptor.spec.ts`) :

```typescript
TestBed.configureTestingModule({
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
    { provide: AuthService, useValue: { getToken: () => 'abc.def.ghi', logout } },
  ],
});

http.get('http://localhost:3000/products').subscribe();
const req = controller.expectOne('http://localhost:3000/products');
expect(req.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
```

---

## 8. Bonnes pratiques

- **Centraliser les appels HTTP dans des services**, jamais directement dans les composants.
- **Typer** les réponses (`get<IProduct[]>`).
- **Ne jamais muter** une requête : utiliser `req.clone()`.
- **Un interceptor = une responsabilité**.
- **Ne jamais envoyer un token à un serveur tiers.**
- **Gérer les erreurs** au niveau global (interceptor) *et* localement si besoin (`subscribe({ error })`).

---

## 9. Récapitulatif

| Élément | Rôle |
|---------|------|
| `provideHttpClient()` | Active `HttpClient` dans l'app standalone |
| `withInterceptors([...])` | Enregistre les intercepteurs fonctionnels |
| `HttpClient` | Effectue les requêtes (`get`, `post`, ...) |
| `HttpInterceptorFn` | Logique transverse (auth, erreurs, logs) |
| `req.clone()` | Modifier une requête (immuable) |
| `catchError` + `throwError` | Réagir à une erreur puis la relancer |
| `HttpTestingController` | Tester les requêtes envoyées |

`HttpClient` gère la **communication**, les **interceptors** factorisent tout ce qui doit s'appliquer à **chaque** requête.
