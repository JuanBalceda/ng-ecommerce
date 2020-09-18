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
  currentCategoryId = 1;
  previousCategoryId = 1;
  searchMode = false;

  pageSize = 5;
  totalElements = 0;
  pageNumber = 1;

  previousKeyword: string;

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
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyword !== keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`);

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword)
      .subscribe(this.processResult());
  }

  handleListProducts(): void {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    // Convert string to number using '+' symbol
    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id') : 1;

    // Check previous category
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
      .subscribe(this.processResult());
  }

  processResult(): any {
    return data => {
      this.products = data._embedded.products;
      this.pageSize = data.page.size;
      this.pageNumber = data.page.number + 1;
      this.totalElements = data.page.totalElements;
      console.log(data);
    };
  }

  updatePageSize(size: number): void {
    this.pageSize = size;
    this.pageNumber = 1;
    this.loadProducts();
  }
}
