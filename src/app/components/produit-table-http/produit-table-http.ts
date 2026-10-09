import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MockProductService } from '../../services/mock-product-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IProduct } from '../../model/IProduct';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AbreviationPipe } from '../../pipes/abreviation-pipe';
import { MatIconModule } from '@angular/material/icon';
import { ProduitCard } from '../produit-card/produit-card';
import { ProductReactiveForm } from '../product-reactive-form/product-reactive-form';
import { ProductService } from '../../services/product-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductReactiveFormHttp } from '../product-reactive-form-http/product-reactive-form-http';

@Component({
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    AbreviationPipe,
    MatIconModule,
    ProductReactiveFormHttp
],
  selector: 'app-produit-table-http',
  styleUrl: './produit-table-http.scss',
  templateUrl: './produit-table-http.html',
})
export class ProduitTableHttp implements OnInit, OnDestroy, AfterViewInit{
 
  private productService = inject(ProductService)
  private snackbar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<IProduct>([]);

  colonnes = ['name', 'description', 'price', 'category', 'stock', 'action']

  
  error = signal('');

  @ViewChild(MatPaginator) paginator! : MatPaginator; 
  @ViewChild(MatSort) sort! : MatSort;

  ngOnDestroy(): void {
    console.log("Component Destroyed !")
  }
  ngOnInit(): void {
    this.loadProducts() 
  
  }
  ngAfterViewInit(): void {
   this.dataSource.paginator = this.paginator; 
   this.dataSource.sort = this.sort;
  }

  deleteProduct(product: IProduct): void{
    const confirmation = confirm(`Voulez-vous supprimer le produit "${product.name}"`);
    if (!confirmation) {return;}

    this.productService.deleteProductById$(product.id).subscribe({
      next: (response) => {
        this.loadProducts();
        this.snackbar.open(response.message, '',{duration: 3000});
      },
      error: (err) => {this.error.set(`Erreur du backEnd: ${err.message || err}`)}
    });
    
  }

  loadProducts(){
    console.log("Load Products Launched");
    
    this.productService.getAllProducts$().subscribe({
      // On définit notre Observer
      next: (productsFromBack) => {this.dataSource.data = productsFromBack; this.error.set('')},
      error: (err) => {this.error.set(`Erreur du backEnd: ${err.message || err}`)}
    }); 
  }

}
