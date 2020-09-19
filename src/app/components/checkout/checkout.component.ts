import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CartService} from '../../services/cart.service';
import {FormService} from '../../services/form.service';
import {State} from '../../common/state';
import {Country} from '../../common/country';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  totalPrice = 0.00;
  totalQuantity = 0;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private formService: FormService) {
  }

  ngOnInit(): void {
    this.initFormGroup();

    this.formService.getCountries().subscribe(data => this.countries = data);

    const startMonth = new Date().getMonth() + 1;
    this.formService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);
    this.formService.getCreditCardYears().subscribe(data => this.creditCardYears = data);

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.computeCartTotals();
  }

  initFormGroup(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }

  onSubmit(): void {
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(this.checkoutFormGroup.get('shippingAddress').value);
    console.log(this.checkoutFormGroup.get('billingAddress').value);
    console.log(this.checkoutFormGroup.get('creditCard').value);
  }

  copyShippingAddressToBillingAddress(event: Event): void {

    // @ts-ignore
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(): void {

    const currentDate: number = new Date().getFullYear();

    const selectedYear: number = Number(this.checkoutFormGroup.get('creditCard').value.expirationYear);

    const startMonth = (currentDate === selectedYear) ? new Date().getMonth() + 1 : 1;
    this.formService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);
  }


  getStates(formGroupName: string): void {

    const formGoup = this.checkoutFormGroup.get(formGroupName);
    const selectedCountryCode: string = formGoup.value.country.code;

    this.formService.getStates(selectedCountryCode).subscribe(data => {

      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else if (formGroupName === 'billingAddress') {
        this.billingAddressStates = data;
      }

      formGoup.get('state').setValue(data[0]);
    });
  }
}
