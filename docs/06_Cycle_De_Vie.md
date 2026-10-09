# Le cycle de vie des composants en Angular

> **Prérequis** : Angular 22, composants standalone, notions de `signal()`, `input()` et de détection de changement.
> **Objectif** : Comprendre les étapes de la vie d'un composant, mais surtout adopter l'approche **réactive** d'Angular v22 (signals, `resource()`, requêtes signal, `afterRenderEffect`) qui rend la plupart des *hooks* classiques inutiles.

---

## 1. Pourquoi parler de cycle de vie ?

Un composant Angular n'est pas un objet figé : il **naît**, se **met à jour** plusieurs fois, puis **meurt**. Historiquement, Angular exposait des points d'accroche — les **hooks** (« crochets ») — pour brancher notre logique à chaque étape (`ngOnInit`, `ngOnDestroy`…).

En **Angular v22**, la donne a changé : avec les **signals**, le mode **zoneless** (sans `zone.js`) et les nouvelles API (`resource`, `viewChild`, `afterRenderEffect`), on écrit du code **réactif** où Angular sait *tout seul* quand recalculer. Résultat : on écrit **beaucoup moins de hooks**.

Bien penser « cycle de vie » permet toujours de :

- **Charger des données** au bon moment (désormais souvent via `resource()`).
- **Réagir aux changements** des `input()` (via `computed()` / `effect()`).
- **Accéder au DOM** en sécurité (via les requêtes signal et `afterNextRender`).
- **Nettoyer** ce qu'on a mis en place, souvent automatiquement (`takeUntilDestroyed`).

> **Règle directrice v22** : avant d'écrire un hook, demandez-vous *« un signal ne ferait-il pas le travail à ma place ? »*. La plupart du temps, la réponse est oui.

---

## 2. La chronologie complète

| Ordre | Hook | Quand ? | Usage typique |
|-------|------|---------|----------------|
| 1 | `constructor` | À la création de la classe | Injection de dépendances (`inject`) |
| 2 | `ngOnChanges` | À chaque changement d'un `@Input` | Réagir à une nouvelle valeur d'entrée |
| 3 | `ngOnInit` | **Une fois**, après le 1er `ngOnChanges` | Initialisation, chargement de données |
| 4 | `ngDoCheck` | À chaque cycle de détection | Détection manuelle (rare, coûteux) |
| 5 | `ngAfterContentInit` | Après projection du contenu (`ng-content`) | Accès au contenu projeté |
| 6 | `ngAfterContentChecked` | Après chaque vérification du contenu | Rare |
| 7 | `ngAfterViewInit` | Après le rendu de la vue et des enfants | Accès au DOM, aux `viewChild` |
| 8 | `ngAfterViewChecked` | Après chaque vérification de la vue | Rare |
| 9 | `ngOnDestroy` | Juste avant la destruction | **Nettoyage** (désabonnements, timers) |

> **⚠️ Point crucial en v22** : les **`input()` signals ne déclenchent PAS `ngOnChanges`**. Pour réagir à une entrée signal, on utilise `computed()` ou `effect()`, pas `ngOnChanges`. Ce dernier ne sert plus qu'aux anciens `@Input()` décorés.

> **À retenir** : en v22, dans la grande majorité des composants, on n'écrit **plus aucun hook** — tout au plus `ngOnInit` pour un démarrage impératif ponctuel.

---

## 3. Les hooks encore utiles 

### a) `ngOnInit` — initialiser 

Le `constructor` sert **uniquement** à l'injection. `ngOnInit` reste pratique pour une initialisation **impérative** (log, configuration ponctuelle). Mais pour **charger des données**, on lui préfère désormais `resource()` (voir § 4).

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Component({ /* ... */ })
export class PageProduits implements OnInit {
  private analytics = inject(AnalyticsService);

  ngOnInit(): void {
    // Effet ponctuel au démarrage (pas de la donnée réactive).
    this.analytics.pageVue('produits');
  }
}
```

### b) `ngOnDestroy` — nettoyer (souvent évitable en v22)

Tout ce qu'on **ouvre** doit être **fermé**. Mais en v22, la plupart des nettoyages sont **automatiques** : `takeUntilDestroyed()` pour RxJS, et les `effect()` se détruisent seuls avec le composant. `ngOnDestroy` ne reste utile que pour des ressources **non gérées par Angular** (ex. `setInterval`, une librairie tierce).

```typescript
import { Component, OnDestroy, DestroyRef, inject } from '@angular/core';

export class Horloge implements OnDestroy {
  private timer = setInterval(() => console.log('tic'), 1000);

  // Variante moderne : enregistrer le nettoyage via DestroyRef,
  // sans implémenter OnDestroy.
  private destroyRef = inject(DestroyRef);
  constructor() {
    this.destroyRef.onDestroy(() => clearInterval(this.timer));
  }

  // (équivalent « à l'ancienne », si vous préférez)
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
```

### c) `ngOnChanges` — obsolète avec les signals

`ngOnChanges` ne se déclenche **que** pour les anciens `@Input()` décorés. Avec un **`input()` signal**, il ne se déclenche **jamais** : on réagit avec `computed()` (valeur dérivée) ou `effect()` (effet de bord). Voir § 4.a.

---

## 4. L'approche réactive d'Angular v22

En v22, on remplace la quasi-totalité des hooks par des primitives réactives.

### a) `computed()` / `effect()` remplacent `ngOnChanges`

Avec les `input()` signals, une valeur dérivée se recalcule toute seule, et un `effect()` se relance à chaque changement d'entrée.

```typescript
import { Component, input, computed, effect } from '@angular/core';

export class Badge {
  note = input.required<number>(); // input signal (requis)

  // Valeur dérivée : recalculée automatiquement quand note() change.
  mention = computed(() => (this.note() >= 10 ? 'Admis' : 'Recalé'));

  constructor() {
    // Effet de bord : se relance à chaque changement de note().
    effect(() => console.log('La note vaut maintenant', this.note()));
  }
}
```

### b) `resource()` / `httpResource()` remplacent le chargement dans `ngOnInit`

Plutôt que d'appeler un service dans `ngOnInit` puis de gérer manuellement l'abonnement, on déclare une **ressource asynchrone**. Elle se (re)charge automatiquement quand ses dépendances (des signals) changent, et expose l'état sous forme de signals.

```typescript
import { Component, input } from '@angular/core';
import { httpResource } from '@angular/common/http';

export class ProduitDetail {
  id = input.required<string>();

  // Se recharge tout seul à chaque changement de id().
  produit = httpResource<Produit>(() => `/api/produits/${this.id()}`);
}
```

```html
@if (produit.isLoading()) {
  <p>Chargement…</p>
} @else if (produit.value(); as p) {
  <h2>{{ p.name }}</h2>
}
```

> `resource()` (source asynchrone quelconque) et `httpResource()` (spécialisé HTTP) exposent `value()`, `isLoading()`, `error()` et `reload()`. Fini le couple « `ngOnInit` + `subscribe` + `ngOnDestroy` » pour la lecture de données.

### c) Requêtes signal (`viewChild`, `contentChild`) remplacent `ngAfterViewInit`

Pour accéder à un élément du template ou à un composant enfant, on utilise les **requêtes signal**. Plus besoin d'attendre `ngAfterViewInit` : on lit un signal.

```typescript
import { Component, viewChild, ElementRef, afterNextRender } from '@angular/core';

export class Graphique {
  // Requête signal : remplace @ViewChild.
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    // Le DOM est prêt ET on est côté navigateur : on peut lire canvas().
    afterNextRender(() => {
      const el = this.canvas()?.nativeElement;
      // ... initialiser une librairie de graphiques, par ex.
    });
  }
}
```

### d) `DestroyRef` + `takeUntilDestroyed` remplacent `ngOnDestroy`

Pour les abonnements RxJS, on évite le `ngOnDestroy` manuel :

```typescript
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

export class Flux {
  constructor() {
    // L'abonnement se coupe TOUT SEUL à la destruction du composant.
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(v => console.log(v));
  }
}
```

### e) `afterNextRender`, `afterRender`, `afterRenderEffect` remplacent `ngAfterViewInit`

Pour agir après le rendu (et de façon **compatible SSR**, car ces callbacks ne s'exécutent **jamais** côté serveur) :

```typescript
import { Component, afterNextRender, afterRenderEffect, signal } from '@angular/core';

export class Widget {
  private largeur = signal(0);

  constructor() {
    // Une seule fois, après le prochain rendu (init d'une lib tierce).
    afterNextRender(() => {
      this.largeur.set(window.innerWidth);
    });

    // Réactif : se relance après le rendu à chaque fois qu'un signal
    // lu à l'intérieur change. C'est le « effect() côté DOM ».
    afterRenderEffect(() => {
      console.log('Largeur courante :', this.largeur());
    });
  }
}
```

- `afterNextRender` : une seule fois, après le prochain rendu.
- `afterRender` : après **chaque** rendu.
- `afterRenderEffect` : version **réactive** (se relance quand un signal lu change), idéale pour synchroniser le DOM avec un état.

---

## 5. Le mode *zoneless* (sans zone.js)

Angular v22 permet de se passer de `zone.js` grâce à `provideZonelessChangeDetection()`. La détection de changement n'est alors déclenchée que par les **signals** (et quelques événements), ce qui améliore les performances.

```typescript
// app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection()],
};
```

> **Conséquence sur le cycle de vie** : en zoneless, les hooks fondés sur des vérifications permanentes (`ngDoCheck`, `ngAfterViewChecked`…) deviennent encore moins pertinents. On **pense signals** : un état = un signal, une dérivée = `computed`, un effet = `effect`.

---

## 6. Schéma mental

```
constructor  →  ngOnInit  →  (rendu)  →  afterNextRender / afterRenderEffect
     │            │                              │
  injection   démarrage                  accès au DOM (via viewChild)
  + signals   impératif
     │
  input()/computed()/effect()  →  réagissent SEULS aux changements
  resource()/httpResource()    →  chargent les données SEULES
     │
              ... vie du composant ...
                                                                ▼
                                                     destruction automatique
                                            (takeUntilDestroyed, effect, DestroyRef)
```

---

## 7. Bonnes pratiques (v22)

- **Pensez signals d'abord** : un état = `signal`, une dérivée = `computed`, un effet = `effect`.
- **Chargez les données avec `resource()` / `httpResource()`** plutôt que `ngOnInit` + `subscribe`.
- **Ne comptez pas sur `ngOnChanges` avec des `input()` signals** : utilisez `computed()` / `effect()`.
- **Accédez au DOM via les requêtes signal** (`viewChild`) et `afterNextRender`, jamais dans le `constructor`.
- **Laissez Angular nettoyer** : `takeUntilDestroyed()`, `effect()` et `DestroyRef.onDestroy()` évitent la plupart des `ngOnDestroy`.
- **Évitez `ngDoCheck` / `...Checked`** : inutiles et coûteux, surtout en **zoneless**.

---

## 8. Récapitulatif

| Besoin | Solution v22 recommandée | Ancien hook remplacé |
|--------|--------------------------|----------------------|
| Injecter des services | `constructor` + `inject()` | — |
| Charger des données | `resource()` / `httpResource()` | `ngOnInit` + `subscribe` |
| Réagir à un `input()` | `computed()` / `effect()` | `ngOnChanges` |
| Accéder à un enfant / au DOM | `viewChild()` + `afterNextRender()` | `ngAfterViewInit` |
| Synchroniser le DOM avec un état | `afterRenderEffect()` | `ngAfterViewChecked` |
| Nettoyer un abonnement | `takeUntilDestroyed()` / `DestroyRef` | `ngOnDestroy` |
| Démarrage impératif ponctuel | `ngOnInit` | (toujours valable) |

Maîtriser le cycle de vie en v22, c'est surtout **écrire moins de hooks** : on décrit un état **réactif** et on laisse Angular décider *quand* recalculer, charger et nettoyer.
