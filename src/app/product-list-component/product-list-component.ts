import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product/product-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list-component',
  imports: [CommonModule],
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.css']
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[] | null>;
  loading = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.loadProducts().subscribe({
      next: () => {
        this.products$ = this.productService.products$;
        this.loading = false;
      },
      error: err => {
        this.error = (err && err.message) || 'Failed to load products';
        this.loading = false;
      }
    });
  }

  trackById(index: number, item: Product): number {
    return item.id;
  }
}
