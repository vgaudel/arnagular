# Les Signal Forms en Angular

> **Prérequis** : Angular 20+, notions de composants standalone, et surtout les **signals** (`signal()`, `computed()`).
> **Objectif** : Construire un formulaire de création d'utilisateur validé, en utilisant l'API expérimentale **Signal Forms** (`@angular/forms/signals`).

---

## 1. Pourquoi une nouvelle API de formulaires ?

Angular proposait historiquement deux approches :

| Approche | Idée directrice |
|----------|-----------------|
| **Template-driven** | La logique vit dans le HTML (`ngModel`). |
| **Reactive Forms** | La logique vit dans le TypeScript (`FormGroup`, `FormControl`). |

Les **Signal Forms** sont la troisième génération. Elles reposent entièrement sur les **signals** :

- La **source de vérité** est un simple objet JavaScript stocké dans un `signal()`.
- Le formulaire se « branche » sur ce signal : toute frappe met à jour le signal, et toute modification du signal met à jour l'écran.
- L'état de validation (`valid`, `errors`, `touched`, ...) est exposé sous forme de **signals**, donc réactif et lisible directement dans le template.

---

## 2. Les 3 briques essentielles

### a) Le modèle de données (un signal)

```typescript
import { signal } from '@angular/core';

const modele = signal({
  nom: '',
  password: '',
  confirmPassword: '',
  birthDate: null as Date | null,
  role: '' as 'admin' | 'editeur' | 'lecteur' | '',
});
```

### b) Le formulaire et son schéma de validation

```typescript
import { form, required, minLength } from '@angular/forms/signals';

const monForm = form(modele, (path) => {
  required(path.nom, { message: 'Le nom est obligatoire.' });
  minLength(path.nom, 3, { message: 'Au moins 3 caractères.' });
});
```

- `form(signal, schéma)` renvoie un **arbre de champs** (`FieldTree`).
- Le paramètre `path` représente le **chemin** vers chaque champ : `path.nom`, `path.password`...
- On y attache des **validateurs**. Chaque validateur accepte une option `{ message }`.

### c) La liaison dans le template

```html
<input type="text" [formField]="monForm.nom" />
```

La directive `FormField` (sélecteur `[formField]`) relie une balise HTML native (`<input>`, `<select>`, `<textarea>`) à un champ du formulaire. Il faut l'ajouter aux `imports` du composant.

---

## 3. Lire l'état d'un champ

Un champ **s'appelle comme une fonction** pour obtenir son état :

```html
@let nomField = monForm.nom();      <!-- l'état du champ -->

@if (nomField.touched()) {          <!-- l'utilisateur a-t-il visité le champ ? -->
  @for (erreur of nomField.errors(); track erreur.kind) {
    <small class="erreur">{{ erreur.message }}</small>
  }
}
```

Signals disponibles sur l'état d'un champ :

| Signal | Rôle |
|--------|------|
| `value()` | La valeur courante (writable). |
| `valid()` / `invalid()` | Le champ est-il valide ? |
| `errors()` | Le tableau des erreurs `{ kind, message }`. |
| `touched()` | Le champ a-t-il été visité (blur) ? |
| `dirty()` | La valeur a-t-elle été modifiée ? |

On appelle aussi `monForm()` (la **racine**) pour connaître l'état global du formulaire : `monForm().invalid()`, `monForm().markAsTouched()`, `monForm().reset()`.

---

## 4. Les validateurs intégrés

| Validateur | Exemple | Rôle |
|------------|---------|------|
| `required` | `required(path.nom)` | Champ non vide. |
| `minLength` | `minLength(path.nom, 3)` | Longueur minimale. |
| `maxLength` | `maxLength(path.bio, 200)` | Longueur maximale. |
| `min` / `max` | `max(path.age, 120)` | Bornes numériques. |
| `minDate` / `maxDate` | `maxDate(path.naissance, new Date())` | Bornes de date. |
| `pattern` | `pattern(path.code, /^[A-Z]+$/)` | Expression régulière. |
| `email` | `email(path.mail)` | Format e-mail. |
| `validate` | (voir ci-dessous) | Règle **sur-mesure**. |

Chaque validateur accepte une option `{ message: '...' }` pour personnaliser le texte affiché.

---

## 5. La validation croisée (double saisie du mot de passe)

Le cas classique : **le champ de confirmation doit être identique au mot de passe**. On utilise `validate()`, qui donne accès à la valeur du champ courant **et** à celle des autres champs :

```typescript
import { validate } from '@angular/forms/signals';

validate(path.confirmPassword, ({ value, valueOf }) =>
  value() !== valueOf(path.password)
    ? { kind: 'passwordMismatch', message: 'Les mots de passe ne correspondent pas.' }
    : null,
);
```

- `value()` → la valeur du champ validé (`confirmPassword`).
- `valueOf(path.password)` → la valeur d'un **autre** champ.
- On renvoie `null` si tout va bien, sinon un objet `{ kind, message }`.

C'est le mécanisme fondamental pour comparer plusieurs champs entre eux.

---

## 6. La validation asynchrone (le nom est-il déjà pris ?)

Certaines règles ne peuvent pas répondre **immédiatement** : savoir si un nom de produit, un e-mail ou un pseudo est **déjà utilisé** nécessite d'interroger le **serveur**. On ne peut pas bloquer l'interface en attendant la réponse → on utilise la validation **asynchrone**.

Avec les Signal Forms, on **n'utilise PAS** les `AsyncValidatorFn` des Reactive Forms. On utilise la fonction **`validateAsync`**, qui s'appuie sur l'API **`resource()`** d'Angular.

```typescript
import { form, required, minLength, validateAsync } from '@angular/forms/signals';
import { resource } from '@angular/core';

const produitForm = form(modele, (path) => {
  required(path.name, { message: 'Le nom du produit est obligatoire.' });
  minLength(path.name, 5, { message: 'Le nom doit contenir au moins 5 caractères.' });

  // ── Validation asynchrone : le nom existe-t-il déjà ? ──
  validateAsync(path.name, {
    // 1) params : la/les valeur(s) réactive(s) surveillée(s).
    //    Dès qu'elle change, la validation se relance automatiquement.
    params: ({ value }) => value().trim(),

    // 2) factory : construit une `resource` dont le `loader` fait le travail async
    //    (appel HTTP, timer, accès à un service...).
    factory: (params) =>
      resource({
        params,
        loader: async ({ params: nom }) => {
          if (!nom) return false;                         // champ vide → `required` s'en charge
          await new Promise((r) => setTimeout(r, 500));    // simule la latence serveur
          return mockProductService.productExists(nom);
        },
      }),

    // 3) errors : transforme le résultat du loader en erreur de champ (ou `undefined`).
    errors: (existeDeja) =>
      existeDeja
        ? { kind: 'nomDejaPris', message: 'Ce nom de produit existe déjà.' }
        : undefined,
  });
});
```

Les **3 parties** de `validateAsync` :

| Partie | Rôle |
|--------|------|
| `params` | Valeur(s) réactive(s) surveillée(s). Un changement relance la validation. |
| `factory` | Retourne une `resource()` dont le `loader` effectue l'appel asynchrone. |
| `errors` | Convertit le résultat du loader en erreur `{ kind, message }`, ou `undefined` si tout va bien. |

### Afficher l'état d'attente dans le template

Pendant la requête, le champ passe à l'état **`pending()`**. On peut afficher un indicateur et, bien sûr, les erreurs une fois la réponse reçue :

```html
@let nameField = produitForm.name();

@if (nameField.pending()) {
  <small class="info">Vérification du nom en cours…</small>
}
@if (nameField.touched()) {
  @for (erreur of nameField.errors(); track erreur.kind) {
    <small class="erreur">{{ erreur.message }}</small>
  }
}
```

### À la soumission

Tant qu'une validation asynchrone est en cours, le champ n'est **ni valide ni invalide** : il est `pending`. Il faut donc en tenir compte avant d'envoyer le formulaire :

```typescript
onSubmit(): void {
  this.produitForm().markAsTouched();

  // On bloque si le formulaire est invalide OU si une validation async tourne encore.
  if (this.produitForm().invalid() || this.produitForm().pending()) {
    return;
  }
  // ... enregistrement
}
```

> **Alternative `validateHttp`** : si la vérification est un simple appel HTTP, `validateHttp(path.name, { request: ..., errors: ... })` encapsule directement le `HttpClient` sans écrire la `resource` à la main.

---

## 7. Soumettre le formulaire

```typescript
onSubmit(): void {
  // Afficher toutes les erreurs, même sur les champs non visités :
  this.monForm().markAsTouched();

  if (this.monForm().invalid()) {
    return; // on bloque l'envoi
  }

  // On retire le champ de confirmation avant d'enregistrer :
  const { confirmPassword, ...utilisateur } = this.modele();
  console.log('Utilisateur valide :', utilisateur);

  // Réinitialisation
  this.modele.set({ nom: '', password: '', confirmPassword: '', birthDate: null, role: '' });
  this.monForm().reset();
}
```

Côté template, on utilise un `<form>` HTML standard :

```html
<form (submit)="$event.preventDefault(); onSubmit()" novalidate>
  ...
  <button type="submit">Enregistrer</button>
</form>
```

---

## 8. Le formulaire complet de ce projet

Le composant `UtilisateurAddForm` (route `/utilisateur-add`, lien **SignalForm** dans le header) illustre tous ces concepts :

- **Nom** : `required` + `minLength(3)`.
- **Mot de passe** : `required` + `minLength(8)` + `pattern` (1 majuscule et 1 chiffre).
- **Confirmation** : `required` + validation croisée avec le mot de passe.
- **Date de naissance** : `required` + `maxDate` (pas dans le futur).
- **Rôle** : `required` (liste déroulante `<select>`).

Fichiers de référence :

- `src/app/model/IUtilisateur.ts` — le modèle de données.
- `src/app/components/utilisateur-add-form/utilisateur-add-form.ts` — le formulaire et ses règles.
- `src/app/components/utilisateur-add-form/utilisateur-add-form.html` — la liaison et l'affichage des erreurs.

---

## 9. Exercices

1. **Champ e-mail** : ajoutez un champ `email` obligatoire au format valide (`required` + `email`).
2. **Force du mot de passe** : affichez en temps réel « Faible / Moyen / Fort » à l'aide d'un `computed()` basé sur `monForm.password().value()`.
3. **Âge minimum** : à l'aide de `validate()` sur `birthDate`, refusez les utilisateurs de moins de 18 ans.
4. **Désactivation conditionnelle** : avec la fonction `disabled()`, désactivez le champ « rôle » tant que le nom est vide.
5. **Bouton intelligent** : désactivez le bouton « Enregistrer » quand `monForm().invalid()` est vrai, plutôt que de bloquer dans `onSubmit()`.
6. **Nom unique (async)** : avec `validateAsync`, refusez un nom de produit déjà présent (via `MockProductService.productExists`) et affichez « Vérification en cours… » pendant l'attente (`pending()`).

---

## 10. À retenir

- Les Signal Forms placent un **signal** au cœur du formulaire : une seule source de vérité.
- `form(signal, schéma)` crée l'arbre de champs ; `[formField]` relie le HTML.
- Chaque champ **s'appelle comme une fonction** pour lire son état réactif (`errors()`, `touched()`, ...).
- `validate()` permet les règles sur-mesure, y compris la **validation croisée** (double saisie).
- `validateAsync()` (appuyé sur `resource()`) gère la **validation asynchrone** (ex. unicité côté serveur) ; le champ passe à l'état `pending()` pendant l'attente.
- L'API vit dans `@angular/forms/signals` et reste **expérimentale**.
