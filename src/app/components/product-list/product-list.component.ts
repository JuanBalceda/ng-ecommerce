import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.loadProducts();
    });
  }

  loadProducts(): void {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.searchProducts();
    } else {
      this.handleListProducts();
    }
  }

  searchProducts(): void {
    const keyword = this.route.snapshot.paramMap.get('keyword');

    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts(): void {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    // Convert string to number using '+' symbol
    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id') : 1;

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
