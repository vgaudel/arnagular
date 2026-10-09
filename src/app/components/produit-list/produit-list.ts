import { Component } from '@angular/core';
import { IProduitLocal } from '../../model/IProduitLocal';
import { ProduitCard } from '../produit-card/produit-card';

@Component({
  imports: [ProduitCard],
  selector: 'app-produit-list',
  styleUrl: './produit-list.scss',
  templateUrl: './produit-list.html',
})
export class ProduitList {

  // Tableau de valeurs en local -> devra être remplacé par un service
  // qui nous fournira les produits
  private produits: IProduitLocal[] = [
    {ref: "A001", label: "Clavier mécanique", prix: 69.99, categorie: "Périphérique"},
    {ref: "A002", label: "Souris basique", prix: 19.99, categorie: "Périphérique"},
    {ref: "A003", label: "Ecran Dell 27''", prix: 69.99, categorie: "Ecran"},
    {ref: "A004", label: "Casque Audio Jabra", prix: 169.99, categorie: "Audio"},
    {ref: "A005", label: "Ecouteurs JBL", prix: 49.99, categorie: "Audio"},
    {ref: "A006", label: "Néon Flamand Rose", prix: 19.99, categorie: "Décoration"},
  ];
}
