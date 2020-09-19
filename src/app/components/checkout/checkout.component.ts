import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CartService} from '../../services/cart.service';
import {FormService} from '../../services/form.service';
import {State} from '../../common/state';
import {Country} from '../../common/country';
import {StringValidators} from '../../validators/string-validators';

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
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          StringValidators.notEmpty]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          StringValidators.notEmpty]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          StringValidators.notEmpty])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, StringValidators.notEmpty]),
        city: new FormControl('', [Validators.required, StringValidators.notEmpty]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, StringValidators.notEmpty])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, StringValidators.notEmpty]),
        city: new FormControl('', [Validators.required, StringValidators.notEmpty]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, StringValidators.notEmpty])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),
        nameOnCard: new FormControl('', [Validators.required, StringValidators.notEmpty]),
        cardNumber: new FormControl('', [
          Validators.required,
          StringValidators.notEmpty,
          Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [
          Validators.required,
          StringValidators.notEmpty,
          Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', Validators.required),
        expirationYear: new FormControl('', Validators.required)
      })
    });
  }

  onSubmit(): void {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

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

  // Getters

  get firstName(): AbstractControl {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(): AbstractControl {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(): AbstractControl {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet(): AbstractControl {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity(): AbstractControl {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState(): AbstractControl {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressCountry(): AbstractControl {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressZipCode(): AbstractControl {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet(): AbstractControl {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity(): AbstractControl {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState(): AbstractControl {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressCountry(): AbstractControl {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressZipCode(): AbstractControl {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get cardType(): AbstractControl {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get nameOnCard(): AbstractControl {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get cardNumber(): AbstractControl {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get securityCode(): AbstractControl {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  get expirationMonth(): AbstractControl {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }

  get expirationYear(): AbstractControl {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

}
