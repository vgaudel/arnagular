# Exercices — Angular Material Components

## Rappel rapide — importer un composant Material

Chaque composant Material est un module indépendant à importer dans `imports[]` du composant standalone :

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  ...
})
```

Tous les composants Material sont documentés sur [material.angular.io](https://material.angular.io).

---

## Exercice 1 — Boutons et variantes ⭐

**Contexte** : Material propose plusieurs variantes visuelles pour les boutons.

**Objectif** : Créer un composant qui affiche **quatre boutons** côte à côte, chacun ayant une variante différente : **basic**, **raised**, **stroked** et **flat**.  
Un signal `clics` compte le nombre total de fois que **n'importe lequel** de ces boutons a été cliqué.

**Contraintes** :
- Utiliser les directives `mat-button`, `mat-raised-button`, `mat-stroked-button`, `mat-flat-button`.
- Chaque bouton doit appeler la même méthode d'incrément.
- Afficher le total sous les boutons.

**Affichage attendu** :
```
[ Cliquer ]  [ Cliquer ]  [ Cliquer ]  [ Cliquer ]
              Total clics : 5
```

---

## Exercice 2 — Slider de luminosité ⭐

**Contexte** : `mat-slider` permet de saisir une valeur numérique de façon visuelle.

**Objectif** : Créer un composant avec un `mat-slider` allant de `0` à `100`.  
Afficher sous le curseur la valeur en pourcentage **et** une icône Material qui change selon la tranche :

| Plage       | Icône            |
|-------------|------------------|
| 0 – 33      | `brightness_low` |
| 34 – 66     | `brightness_medium` |
| 67 – 100    | `brightness_high` |

**Contraintes** :
- Utiliser `MatSliderModule` et `MatIconModule`.
- La valeur du slider doit piloter l'icône via un `computed()` ou un `@if`.

**Affichage attendu** :
```
[━━━━━━●──────────]
☀ 45 %
```

---

## Exercice 3 — Liste de courses avec checkboxes ⭐

**Contexte** : `mat-checkbox` permet de cocher/décocher des éléments de façon accessible.

**Objectif** : Afficher une liste fixe de 6 articles de courses.  
Chaque article est accompagné d'un `mat-checkbox`.  
Afficher en bas le nombre d'articles **cochés** et le nombre **restants**.

**Contraintes** :
- Stocker la liste comme un tableau d'objets `{ nom: string, coche: boolean }`.
- Utiliser `MatCheckboxModule`.
- Calculer les comptes avec `computed()` ou directement dans le template.

**Affichage attendu** :
```
☑ Pommes
☐ Pain
☑ Lait
...
Cochés : 2 / 6  —  Restants : 4
```

---

## Exercice 4 — Chips de filtrage ⭐⭐

**Contexte** : `mat-chip` est utilisé pour représenter des tags, catégories ou filtres.

**Objectif** : Afficher une collection de **chips de catégories** (ex : Fruits, Légumes, Viandes, Poissons, Épices).  
Cliquer sur un chip le sélectionne / déselectionne.  
Afficher sous les chips la liste des catégories actuellement sélectionnées.

**Contraintes** :
- Utiliser `MatChipsModule`.
- Un chip sélectionné doit avoir un style visuel distinct (classe, couleur ou `selected`).
- La liste affichée doit se mettre à jour dynamiquement.

**Affichage attendu** :
```
[ Fruits ✓ ]  [ Légumes ]  [ Viandes ✓ ]  [ Poissons ]  [ Épices ]

Sélection : Fruits, Viandes
```

---

## Exercice 5 — Onglets de profil ⭐⭐

**Contexte** : `mat-tab-group` permet d'organiser du contenu en onglets.

**Objectif** : Créer un formulaire de profil réparti sur **trois onglets** :
1. **Identité** — Prénom, Nom (mat-form-field / matInput)
2. **Contact** — Email, Téléphone
3. **Récapitulatif** — Affiche en lecture seule toutes les valeurs saisies

**Contraintes** :
- Utiliser `MatTabsModule`, `MatFormFieldModule`, `MatInputModule`.
- Le troisième onglet ne contient aucun champ de saisie, seulement de l'affichage.
- Les données doivent être réactives (ngModel ou signals) : le récapitulatif se met à jour sans action de l'utilisateur.

**Affichage attendu** :
```
[ Identité ]  [ Contact ]  [ Récapitulatif ]

Prénom : [ Jean        ]
Nom    : [ Dupont      ]
```

---

## Exercice 6 — FAQ avec panneaux d'expansion ⭐⭐

**Contexte** : `mat-expansion-panel` est idéal pour afficher du contenu accordéon style FAQ.

**Objectif** : Créer une FAQ avec **5 questions/réponses** stockées dans un tableau de l'objet.  
Chaque entrée est représentée par un `mat-expansion-panel`.  
Un bouton **Tout fermer** remet tous les panneaux à leur état initial.

**Contraintes** :
- Utiliser `MatExpansionModule`.
- Générer les panneaux avec `@for`.
- Chaque panneau doit afficher la question dans `mat-panel-title` et la réponse dans le corps.
- Le bouton "Tout fermer" utilise la propriété `expanded` liée à un signal ou un boolean par élément.

**Affichage attendu** :
```
▼ Qu'est-ce qu'Angular Material ?
  Angular Material est une librairie de composants UI pour Angular...

▶ Quels sont les composants disponibles ?
▶ Comment personnaliser le thème ?
...
              [ Tout fermer ]
```

---

## Exercice 7 — Tableau de données triable ⭐⭐⭐

**Contexte** : `mat-table` est le composant Material pour afficher des données tabulaires. Il s'intègre avec `MatSort` pour le tri.

**Objectif** : Afficher un tableau de **8 employés** (nom, département, salaire).  
Le tableau doit être **triable** en cliquant sur les en-têtes de colonnes.

**Données de départ** :
```typescript
const employes = [
  { nom: 'Alice',   departement: 'RH',          salaire: 3200 },
  { nom: 'Bob',     departement: 'Informatique', salaire: 4100 },
  { nom: 'Clara',   departement: 'Finance',      salaire: 3800 },
  { nom: 'David',   departement: 'Informatique', salaire: 4500 },
  { nom: 'Emma',    departement: 'RH',          salaire: 3100 },
  { nom: 'Félix',  departement: 'Marketing',    salaire: 3300 },
  { nom: 'Grace',   departement: 'Finance',      salaire: 3900 },
  { nom: 'Hugo',    departement: 'Marketing',    salaire: 3400 },
];
```

**Contraintes** :
- Utiliser `MatTableModule`, `MatSortModule`.
- Utiliser `MatTableDataSource` pour alimenter le tableau.
- Brancher `MatSort` avec `@ViewChild(MatSort)` et `dataSource.sort`.
- Afficher les trois colonnes avec les headers cliquables.

---

## Exercice 8 — Formulaire d'inscription en étapes ⭐⭐⭐

**Contexte** : `mat-stepper` guide l'utilisateur à travers un processus multi-étapes.

**Objectif** : Créer un formulaire d'inscription **linéaire** en 3 étapes avec `mat-stepper` :

1. **Compte** — Nom d'utilisateur (requis, min 3 car.), mot de passe (requis, min 6 car.)
2. **Informations** — Prénom (requis), Nom (requis), Email (requis, format email)
3. **Confirmation** — Récapitulatif des données + bouton **Valider l'inscription**

**Contraintes** :
- Utiliser `MatStepperModule`, `ReactiveFormsModule`.
- Chaque étape doit avoir son propre `FormGroup`.
- Le stepper doit être en mode `linear` : l'étape suivante n'est accessible que si l'étape courante est valide.
- L'étape 3 ne contient pas de formulaire, juste un affichage des valeurs des deux premiers `FormGroup`.

---

## Exercice 9 — Saisie de tags avec autocomplétion ⭐⭐⭐

**Contexte** : Combiner `mat-autocomplete` et `mat-chip-grid` permet de construire une saisie de tags sophistiquée.

**Objectif** : Créer un champ de saisie qui propose des suggestions de compétences (autocomplétion).  
Sélectionner une suggestion l'ajoute sous forme de **chip** dans une liste.  
Un chip peut être supprimé en cliquant sur son bouton ✕.

**Liste de suggestions** :
```typescript
const competences = ['Angular', 'React', 'Vue', 'TypeScript', 'JavaScript',
                     'Node.js', 'Python', 'Docker', 'Git', 'SQL'];
```

**Contraintes** :
- Utiliser `MatAutocompleteModule`, `MatChipsModule`, `MatIconModule`, `MatFormFieldModule`.
- Filtrer les suggestions en temps réel selon la saisie courante.
- Ne pas proposer dans l'autocomplétion les compétences déjà sélectionnées.
- Vider le champ de saisie après chaque ajout.

**Affichage attendu** :
```
[ Angular ✕ ]  [ TypeScript ✕ ]  [ ang...  ]
                                  Angular
                                  React
```

---

## Exercice 10 — CRUD avec Dialog et Snackbar ⭐⭐⭐⭐

**Contexte** : Combiner `mat-table`, `MatDialog` et `MatSnackBar` pour une expérience complète de gestion de données.

**Objectif** : Créer une interface de gestion d'une liste de contacts affichée dans un `mat-table`.  
L'utilisateur peut :
- **Ajouter** un contact via un bouton qui ouvre un `MatDialog` contenant un formulaire réactif (nom + email).
- **Supprimer** un contact en cliquant sur un bouton dans la ligne du tableau.
- Chaque action (ajout ou suppression) déclenche un **`MatSnackBar`** avec un message de confirmation pendant 3 secondes.

**Contraintes** :
- Utiliser `MatTableModule`, `MatDialogModule`, `MatSnackBarModule`, `MatButtonModule`, `MatFormFieldModule`, `MatInputModule`, `ReactiveFormsModule`.
- Le dialog est un **composant séparé** (`ContactDialogComponent`) passé à `dialog.open()`.
- La donnée retournée par le dialog (via `dialogRef.close(data)`) est utilisée pour mettre à jour la liste.
- Le tableau se rafraîchit automatiquement après chaque opération (penser à `[...data]` pour déclencher la détection de changements).

**Affichage attendu** :
```
[ + Ajouter un contact ]

Nom            Email                    Action
───────────────────────────────────────────────
Alice Martin   alice@example.com        [ 🗑 ]
Bob Dupont     bob@example.com          [ 🗑 ]

─────────────────────────────────────
✔ Contact "Clara Petit" ajouté !          ✕
```

---

## Récapitulatif des composants couverts

| Exercice | Composants Material |
|----------|---------------------|
| 1 | `mat-button` (4 variantes) |
| 2 | `mat-slider`, `mat-icon` |
| 3 | `mat-checkbox` |
| 4 | `mat-chip`, `mat-chip-set` |
| 5 | `mat-tab-group`, `mat-form-field`, `matInput` |
| 6 | `mat-expansion-panel` |
| 7 | `mat-table`, `MatSort`, `MatTableDataSource` |
| 8 | `mat-stepper` (linear), `ReactiveFormsModule` |
| 9 | `mat-autocomplete`, `mat-chip-grid` |
| 10 | `MatDialog`, `MatSnackBar`, `mat-table`, CRUD complet |
