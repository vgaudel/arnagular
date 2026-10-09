import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    ProductReactiveForm
],
  selector: 'app-produit-table',
  styleUrl: './produit-table.scss',
  templateUrl: './produit-table.html',
})
export class ProduitTable implements OnInit, OnDestroy, AfterViewInit{
 
  private productService = inject(MockProductService)
  dataSource = new MatTableDataSource<IProduct>([]);

  colonnes = ['name', 'description', 'price', 'category', 'stock', 'action']

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

    this.productService.deleteProductById(product.id);
    this.loadProducts()
  }

  loadProducts(){
    console.log("Load Products Launched");
    
    this.dataSource.data = this.productService.getAllProducts(); 
  }

}
