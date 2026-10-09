import { Component, computed, effect, signal, untracked, WritableSignal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-signals',
  styleUrl: './signals.scss',
  templateUrl: './signals.html',
})
export class Signals {

  // ==========================================================================
  //  DÉMO 1 : PROPRIÉTÉ CLASSIQUE vs SIGNAL (le cœur du "zoneless")
  // ==========================================================================
  //
  //  count1 : une propriété TypeScript "normale". Sa valeur peut changer,
  //           mais RIEN ne prévient Angular. En mode zoneless, si on la
  //           modifie via un setTimeout (voir constructor), la vue NE se
  //           met PAS à jour automatiquement : l'écran affiche toujours 10.
  //
  //  count2 : un signal. Quand on appelle count2.set(...), le signal notifie
  //           Angular, qui rafraîchit précisément le {{ count2() }} du
  //           template. La vue se met bien à jour.
  //
  //  WritableSignal<number> = le TYPE d'un signal modifiable contenant un
  //  nombre. On peut aussi écrire simplement `count2 = signal(10)` :
  //  TypeScript infère le type tout seul.
  count1: number = 10;
  count2: WritableSignal<number> = signal(10);

  // ==========================================================================
  //  DÉMO 2 : computed() — une valeur DÉRIVÉE recalculée automatiquement
  // ==========================================================================
  //
  //  prixHT et tva sont deux signals "sources".
  //  prixTTC est un computed : il ne stocke pas de valeur "en dur", il la
  //  RECALCULE à partir de prixHT() et tva(). Angular détecte que le calcul
  //  lit ces deux signals : dès que l'un d'eux change, prixTTC est recalculé.
  //
  //  Avantages d'un computed :
  //    - toujours synchronisé avec ses sources (impossible d'être "périmé") ;
  //    - "paresseux" (lazy) : recalculé seulement s'il est lu ;
  //    - "mémorisé" (memoized) : tant que les sources ne changent pas, il
  //      renvoie la valeur en cache sans refaire le calcul ;
  //    - lecture seule : on ne peut PAS faire prixTTC.set(...).
  prixHT = signal(100);
  tva = signal(20);

  prixTTC = computed(()=> this.prixHT() * (1+this.tva()/100));

  log(){
    console.log("click");
  }

 // ==========================================================================
  //  DÉMO 3 : .update() — modifier un signal À PARTIR de sa valeur précédente
  // ==========================================================================
  //
  //  Deux façons d'écrire dans un signal :
  //    - .set(x)            : remplace la valeur par x (valeur indépendante) ;
  //    - .update(v => ...)  : calcule la nouvelle valeur À PARTIR de l'ancienne.
  //
  //  Ici on incrémente/décrémente : la nouvelle valeur dépend de l'ancienne,
  //  donc .update() est le bon choix (plus sûr qu'un .set(compteur() + 1)).

  compteur = signal(0);

  incrementer(): void{
    this.compteur.update(valeur => valeur + 1);
  }

  decrementer(): void{
    this.compteur.update(valeur => valeur - 1);
  }

  // ==========================================================================
  //  DÉMO 4 : SIGNAL DE TYPE TABLEAU — mise à jour IMMUABLE
  // ==========================================================================
  //
  //  Règle d'or avec les signals : ne JAMAIS muter la valeur "en place".
  //  Un signal détecte un changement en comparant les RÉFÉRENCES.
  //
  //    ❌  this.paniers().push('Orange')   -> même tableau (même référence) :
  //                                            Angular ne voit AUCUN changement.
  //    ✅  this.paniers.update(liste => [...liste, 'Orange'])
  //                                         -> on crée un NOUVEAU tableau :
  //                                            la référence change, Angular
  //                                            détecte la mise à jour.
  //
  //  Le "spread" [...liste, fruit] copie les anciens éléments puis ajoute le
  //  nouveau, produisant un tableau tout neuf. Même principe pour les objets.

  panier = signal<string[]>(['Pomme', 'Banane']);

  ajouterFruit(fruit: string){
    this.panier.update(liste => [...liste, fruit]);
  }
  // ==========================================================================
  //  DÉMO 5 : untracked() — lire un signal SANS s'y abonner
  // ==========================================================================
  //
  //    Scénario : on suit la partie d'un joueur.
  //    - 'score'  : à chaque fois qu'il change, on veut écrire une ligne de log.
  //    - 'niveau' : on veut juste CONNAITRE le niveau au moment du log,
  //                 mais on ne veut PAS écrire une nouvelle ligne quand SEUL
  //                 le niveau change.
  //
  //    Normalement, lire un signal dans un effect (ou un computed) crée une
  //    DÉPENDANCE : l'effect se relance automatiquement dès que ce signal
  //    change. untracked(() => monSignal()) permet de LIRE la valeur SANS
  //    créer cette dépendance : on obtient la valeur, mais on ne "s'abonne"
  //    pas à ses futurs changements.
  //
  //    Cas d'usage typiques d'untracked() :
  //      - logger/mesurer une valeur "de contexte" sans la suivre ;
  //      - éviter des recalculs en boucle sur des signals secondaires.
  score = signal(0);
  niveau = signal(1);

  gagnerPoints() {
    this.score.update(s => s + 10);
  }

  monterNiveau() {
    this.niveau.update(n => n + 1);
  }

  // ==========================================================================
  //  DÉMO 7 : effect() — RÉAGIR aux changements de signals
  // ==========================================================================
  //
  //  Un effect() est un bloc de code qui s'exécute :
  //    1. une première fois immédiatement ;
  //    2. puis À CHAQUE FOIS qu'un des signals qu'il LIT change de valeur.
  //
  //  Angular repère automatiquement les signals lus à l'intérieur : ce sont
  //  les "dépendances" de l'effect. On l'utilise pour des EFFETS DE BORD :
  //  logger, synchroniser avec le localStorage, appeler une API, etc.
  //  (Un effect ne doit PAS servir à calculer une valeur -> utiliser computed.)
  //
  //  Important : un effect() doit être créé dans un "contexte d'injection"
  //  (le plus simple : dans le constructeur, comme ci-dessous).
  constructor(){
    // --- Illustration "zoneless" : count1 (propriété) vs count2 (signal) ---
    // count1 est modifié après 5s mais N'est PAS un signal : en zoneless,
    // la vue ne se rafraîchit pas -> l'écran continue d'afficher 10.
    setTimeout(()=> this.count1=30,5000);
    setTimeout(()=> this.count2.set(50),4000);
    setTimeout(()=> this.prixHT.set(200),5000);
    setTimeout(()=> this.tva.set(5),8000);
    // for(let i:number=0;i<50;i++){
    //   setTimeout(()=> this.compteur.set(0),(i*3000));
    // }
    setTimeout(()=>this.ajouterFruit('Cerise'),7000);

    // effect n°1 : se relance à chaque changement de prixHT (signal lu ici)  
    effect(() => console.log("Nouveau prix HT " + this.prixHT()));
    // effect n°2 : illustre untracked().
    // Il se relance UNIQUEMENT quand 'score' change (signal suivi).
    // 'niveau' est lu via untracked() : sa valeur apparait dans le log,
    // mais changer le niveau ne relance PAS l'effect.
    effect(() => {
      const scoreActuel = this.score();
      const niveauActuel = untracked(() => this.niveau());
      console.log(`Score : ${scoreActuel} (au niveau ${niveauActuel})`);
    });
    // effect n°3 : effect() avec fonction de NETTOYAGE (onCleanup).
    // onCleanup enregistre du code à exécuter AVANT la prochaine exécution de
    // l'effect (ou quand le composant est détruit). Idéal pour annuler un
    // timer, se désabonner, fermer une connexion... et éviter les fuites.
    //
    // Ici : à chaque changement de 'compteur', on programme un log dans 1s.
    // Si 'compteur' rechange avant la fin, onCleanup annule le timer précédent
    // (clearTimeout) : le message ne s'affiche que si le compteur reste
    // STABLE pendant 1 seconde (technique de "debounce").
    effect((onCleanup) => {

      const valeur = this.compteur();
      
      const timer = setTimeout(
        () => console.log(`Compteur stabilisé depuis 1sec à ${valeur}`),
        1000
      );
      
      onCleanup(() => clearTimeout(timer));
    });
  }
}
