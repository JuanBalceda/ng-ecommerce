import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../common/product';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../common/ProductCategory';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) {
  }

  getProductListPaginate(page: number, size: number, categoryId: number): Observable<GetResponseProduct> {

    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  searchProductsPaginate(page: number, size: number, productName: string): Observable<GetResponseProduct> {

    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${productName}&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    const categoriesUrl = `${this.baseUrl}/product-category`;

    return this.httpClient.get<GetResponseProductCategory>(categoriesUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }


  getProduct(productId: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/products/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
