import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { ProductService } from '../../services/product-service';
import { champsDifferentsValidator } from '../../validators/champs-differents-validator';
import { nomProduitUniqueAsyncValidator } from '../../validators/nom-produit-unique-asyncvalidator';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatAnchor,
    MatHint
  ],
  selector: 'app-product-reactive-form-http',
  styleUrl: './product-reactive-form-http.scss',
  templateUrl: './product-reactive-form-http.html',
})
export class ProductReactiveFormHttp implements OnInit{

  private snackbar = inject(MatSnackBar);
  private productService = inject(ProductService);
  categories = signal<string[]>([]);

    productAdded = output();
  
    form = new FormGroup(
      {
        name: new FormControl('',
          {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.minLength(5)
            ],
            asyncValidators: [nomProduitUniqueAsyncValidator(this.productService)]
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
      }// On ajoute le validator sur le formGroup en dernier dans son constructeur
      , champsDifferentsValidator('name','description')
    )
    onSubmit():void {
      
      if(this.form.invalid){
        return;
      }
  
      console.log(this.form.getRawValue());
      this.productService.createProduct$(this.form.getRawValue()).subscribe({
        next: (response) =>  {
          this.snackbar.open(`Produit ${response.name} créé avec l'id ${response.id}`, '',{duration: 3000})
          this.form.reset();
          this.productAdded.emit();},
        error : (err)  =>  this.snackbar.open(err, '',{duration: 3000}),
    });
  
      
      
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  
    ngOnInit(): void {
       this.productService.getProductsCategories$().subscribe({
            next: (response) => {
              this.categories.set([...response]);
            },
            error: (err) => {console.log(`Erreur du backEnd: ${err.message || err}`)}
         });
    }
}
