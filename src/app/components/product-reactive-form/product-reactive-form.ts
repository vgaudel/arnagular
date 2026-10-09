import { Component, inject, output } from '@angular/core';
import { MockProductService } from '../../services/mock-product-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { nomProduitUniqueAsyncValidator } from '../../validators/nom-produit-unique-asyncvalidator';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatError,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatIconModule,
    MatAnchor
],
  selector: 'app-product-reactive-form',
  styleUrl: './product-reactive-form.scss',
  templateUrl: './product-reactive-form.html',
})
export class ProductReactiveForm {
  private productService = inject(MockProductService);
  productAdded = output();

  // ────────────────────────────────────────────────────────────────────────────
  // FormGroup : regroupe plusieurs FormControl sous un objet unique.
  // Chaque FormControl accepte : (valeurInitiale, validateurSync, validateurAsync)
  //
  // Validators disponibles (built-in) :
  //   Validators.required          → le champ ne doit pas être vide
  //   Validators.requiredTrue      → la valeur doit être true (case à cocher)
  //   Validators.minLength(n)      → longueur minimale de n caractères
  //   Validators.maxLength(n)      → longueur maximale de n caractères
  //   Validators.min(n)            → valeur numérique minimale
  //   Validators.max(n)            → valeur numérique maximale
  //   Validators.email             → format email valide
  //   Validators.pattern(regex)    → correspond à une expression régulière
  //   Validators.nullValidator     → ne fait rien (placeholder utile)
  //   Validators.compose([...])    → combine plusieurs validateurs (équivalent à un tableau)
  //   Validators.composeAsync([...]) → idem pour les validateurs asynchrones
  // ────────────────────────────────────────────────────────────────────────────

  form = new FormGroup(
    {
      name: new FormControl('',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(5)
          ],
          asyncValidators: []
        }),
      description: new FormControl('',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50)
          ],
          asyncValidators: []
        }
      ),
      price: new FormControl<number>(0,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.min(0.01)
          ],
          asyncValidators: []
        }
      ),
      category: new FormControl('',  {
        nonNullable: true,
        validators: [
          Validators.required,
        ],
        asyncValidators: []
      }),
      stock: new FormControl<number>(0, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
        ],
        asyncValidators: []
      }),
    }
  )
  onSubmit():void {
    
    if(this.form.invalid){
      return;
    }

    console.log(this.form.getRawValue());
    this.productService.createProduct(this.form.getRawValue());

    this.form.reset();
    this.productAdded.emit();
    
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
