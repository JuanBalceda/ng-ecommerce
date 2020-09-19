import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/CartItem';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];

  totalPrice = 0.00;
  totalQuantity = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.updateCartDetails();
  }

  updateCartDetails(): void {

    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.computeCartTotals();
  }

  removeFromCart(item: CartItem): void {
    this.cartService.remove(item);
  }

  incrementQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  decrementQuantity(item: CartItem): void {
    this.cartService.decrementQuantity(item);
  }
}
