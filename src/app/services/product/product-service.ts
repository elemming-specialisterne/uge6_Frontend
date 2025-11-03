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

	constructor(private http: HttpClient) { }

	//   async loadProducts(): Promise<Product[]> {
	//     const cached = this.productsSubject.value;

	//     // if (cached !== null) {
	//     //   return of(cached);
	//     // }

	// 	return this.api<Product[]>('GET', 'api/Products', undefined)
	// 	.then(response => {
	// 		console.log(response);
	// 		// this.accessToken = response.access_token;
	// 		// const payload = JSON.parse(atob(response.access_token.split('.')[1]));
	// 		// this.userSubject.next(this.accessToken);
	// 		return response;
	// 	})
	// 	.catch(error => {
	// 		console.error('Error:', error);
	// 		return Promise.reject(error);
	// 	});

	//     // return this.http.get<Product[]>('api/Products').pipe(
	//     //   tap(products => this.productsSubject.next(products)),
	//     //   catchError(err => {
	//     //     console.error('ProductService.loadProducts error:', err);
	//     //     this.productsSubject.next([]); // optional: set to empty so subscribers know it loaded
	//     //     return of([] as Product[]);
	//     //   })
	//     // );
	//     // return this.http.get<Product[]>(this.url).pipe(
	//     //   tap(products => this.productsSubject.next(products)),
	//     //   catchError(err => {
	//     //     console.error('ProductService.loadProducts error:', err);
	//     //     this.productsSubject.next([]); // optional: set to empty so subscribers know it loaded
	//     //     return of([] as Product[]);
	//     //   })
	//     // );
	//   }

	loadProducts(): Observable<Product[]> {
		const cached = this.productsSubject.value;
		if (cached !== null) {
			return of(cached);
		}

		return this.http.get<Product[]>('https://localhost:7152/api/Products', { withCredentials: true }).pipe(
			tap(products => this.productsSubject.next(products)),
			catchError(err => {
				console.error('ProductService.loadProducts error:', err);
				this.productsSubject.next([]);
				return of([] as Product[]);
			})
		);
	}

	getCachedProducts(): Product[] | null {
		return this.productsSubject.value;
	}

	//   refreshProducts(): Observable<Product[]> {
	//     this.productsSubject.next(null);
	//     return this.loadProducts();
	//   }

	async api<T>(method: string, path: string, body: {} | undefined): Promise<T> {
		const BASE_URL = 'https://localhost:7252';
		// const TOKEN =
		const response = await fetch(`${BASE_URL}/${path}`, {
			method,
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${TOKEN}`
			},
			credentials: 'include',
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		//    And can also be used here ↴
		return await response.json() as T;
	}
}
