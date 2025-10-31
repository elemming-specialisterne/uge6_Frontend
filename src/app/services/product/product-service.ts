// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly url = 'assets/PRODUCT_MOCK_DATA.json';
  private productsSubject = new BehaviorSubject<Product[] | null>(null);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadProducts(): Observable<Product[]> {
    const cached = this.productsSubject.value;

    if (cached !== null) {
      return of(cached);
    }

    return this.http.get<Product[]>(this.url).pipe(
      tap(products => this.productsSubject.next(products)),
      catchError(err => {
        console.error('ProductService.loadProducts error:', err);
        this.productsSubject.next([]); // optional: set to empty so subscribers know it loaded
        return of([] as Product[]);
      })
    );
  }

  getCachedProducts(): Product[] | null {
    return this.productsSubject.value;
  }

  refreshProducts(): Observable<Product[]> {
    this.productsSubject.next(null);
    return this.loadProducts();
  }
}
