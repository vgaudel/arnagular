import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbreviationPipe } from '../../pipes/abreviation-pipe';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';

@Component({
  imports: [CommonModule, AbreviationPipe, TimeAgoPipe],
  selector: 'app-pipes-exemples',
  styleUrl: './pipes-exemples.scss',
  templateUrl: './pipes-exemples.html',
})
export class PipesExemples {

  // Pipes sur les chaînes de caractères
  nom = "John Legend BAGUETTE";

  // pipes sur les nombres
  prix = 1234.567;
  pourcentage = 0.8542;

  // pipes sur les dates
  maintenant = new Date();

  hier = new Date("2026-10-08T11:07:00") ;

  // Pipes sur les objets / JSON
  utilisateur = {
    prenom : 'Marie',
    nom : 'Curie',
    age : 66,
    prix_nobel : ['Physique','Chimie', 'Maths', 'Biologie']
  }

}
