import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../model/IProduct';

@Service()
export class ProductService {

    private http = inject(HttpClient);
    private readonly apiUrl = "http://localhost:3000";

    getAllProducts$(): Observable<IProduct[]>{
        return this.http.get<IProduct[]>(this.apiUrl+'/products');
    }

    getProductsCategories$() : Observable<string[]>{
        return this.http.get<string[]>(this.apiUrl+'/products/categories');
    }

    productExists$(name: string) : Observable<boolean>{
        return this.http.get<boolean>(this.apiUrl+'/products/exists/'+encodeURIComponent(name));
    }

    createProduct$(productToCreate: Omit<IProduct, 'id'>): Observable<IProduct>{
        return this.http.post<IProduct>(this.apiUrl+'/products',productToCreate);
    }

    deleteProductById$(id: string): Observable<{message: string}>{
        return this.http.delete<{message: string}>(this.apiUrl+"/products/"+id);
    }
}
