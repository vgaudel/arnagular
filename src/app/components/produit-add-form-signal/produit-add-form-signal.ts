import { Component, inject, output, signal } from '@angular/core';
import {
  form,
  required,
  minLength,
  maxLength,
  min,
  FormField,
} from '@angular/forms/signals';
import { MockProductService } from '../../services/mock-product-service';
import { IProduct } from '../../model/IProduct';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

// Type du modèle du formulaire : identique à IProduct mais SANS l'id
// (l'id est généré par le service lors de la création).
type IProduitForm = Omit<IProduct, 'id'>;

@Component({
  selector: 'app-produit-add-form-signal',
  // FormField est la DIRECTIVE (sélecteur [formField]) qui relie une balise HTML
  // native (<input>) à un champ du formulaire signal.
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './produit-add-form-signal.html',
  styleUrl: './produit-add-form-signal.scss',
})
export class ProduitAddFormSignal {
  private _mockProductService = inject(MockProductService);
  private _routeur = inject(Router);

  productAdded = output();

  // ──────────────────────────────────────────────────────────────────────────
  // 1) LE MODÈLE DE DONNÉES (un signal)
  // ──────────────────────────────────────────────────────────────────────────
  // Avec les « Signal Forms », la source de vérité est un SIGNAL qui contient un
  // objet JavaScript classique. Le formulaire se « branche » dessus : toute
  // frappe met à jour ce signal, et toute écriture dans ce signal met à jour
  // l'écran (liaison bidirectionnelle).
  protected readonly modele = signal<IProduitForm>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2) LE FORMULAIRE + SES RÈGLES DE VALIDATION (le « schéma »)
  // ──────────────────────────────────────────────────────────────────────────
  // Mêmes validateurs que la version Reactive Forms :
  //   name        : required + minLength(5)
  //   description : required + minLength(5) + maxLength(50)
  //   price       : required + min(0.01)
  //   category    : required
  //   stock       : required + min(0)
  protected readonly produitForm = form(this.modele, (path) => {
    // --- Nom : obligatoire + au moins 5 caractères ---
    required(path.name, { message: 'Le nom du produit est obligatoire.' });
    minLength(path.name, 5, {
      message: 'Le nom doit contenir au moins 5 caractères.',
    });

    // --- Description : obligatoire + entre 5 et 50 caractères ---
    required(path.description, { message: 'La description du produit est obligatoire.' });
    minLength(path.description, 5, {
      message: 'La description doit contenir au moins 5 caractères.',
    });
    maxLength(path.description, 50, {
      message: 'La description doit contenir au maximum 50 caractères.',
    });

    // --- Prix : obligatoire + supérieur à 0 ---
    required(path.price, { message: 'Le prix du produit est obligatoire.' });
    min(path.price, 0.01, { message: 'Le prix doit être supérieur à 0.' });

    // --- Catégorie : obligatoire ---
    required(path.category, { message: 'La catégorie du produit est obligatoire.' });

    // --- Stock : obligatoire + positif ou nul ---
    required(path.stock, { message: 'Le stock du produit est obligatoire.' });
    min(path.stock, 0, { message: 'Le stock doit être positif ou nul.' });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3) SOUMISSION DU FORMULAIRE
  // ──────────────────────────────────────────────────────────────────────────
  protected onSubmit(): void {
    // markAsTouched() marque tous les champs comme « visités » afin que les
    // messages d'erreur s'affichent même sur les champs jamais cliqués.
    this.produitForm().markAsTouched();

    // invalid() est un signal booléen : true si au moins un champ est en erreur.
    if (this.produitForm().invalid()) {
      return;
    }

    console.log(this.modele());
    this._mockProductService.createProduct(this.modele());
    //this._routeur.navigateByUrl('produits');

    // Réinitialisation : on remet le modèle à vide...
    this.modele.set({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
    });
    // ...puis on efface les états « touched/dirty » pour repartir proprement.
    this.produitForm().reset();

    this.productAdded.emit();
  }
}
