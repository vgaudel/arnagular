import { Component, input } from '@angular/core';
import { IProduitLocal } from '../../model/IProduitLocal';

@Component({
  imports: [],
  selector: 'app-produit-card',
  styleUrl: './produit-card.scss',
  templateUrl: './produit-card.html',
})
export class ProduitCard {
  //Le produit à afficher est fourni
  //par le composant parent ProduitList
  produit = input.required<IProduitLocal>();
  estEnRupture = input<boolean>();
}
