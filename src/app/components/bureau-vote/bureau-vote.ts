import { Component, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-bureau-vote',
  styleUrl: './bureau-vote.scss',
  templateUrl: './bureau-vote.html',
})
export class BureauVote {

    // -------------------------------------------------------
  // output() — Émet un événement VERS le parent
  // -------------------------------------------------------

  // output<string>() crée un OutputEmitterRef qui émet des valeurs de type string.
  // Le parent écoute cet événement avec (aVote)="maMethode($event)"

  aVote=output<string>()

  voter(choix: string){
    // .emit(value) envoie value au parent
    this.aVote.emit(choix);
  }

}
