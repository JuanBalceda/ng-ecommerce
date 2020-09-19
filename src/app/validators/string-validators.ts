import {FormControl, ValidationErrors} from '@angular/forms';

export class StringValidators {

  static notEmpty(control: FormControl): ValidationErrors {

    if ((control.value) && (control.value.trim().length === 0)) {
      return {notEmpty: true};
    } else {
      return null;
    }
  }
}
