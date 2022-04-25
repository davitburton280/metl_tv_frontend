import {AbstractControl, ValidatorFn, FormGroup} from '@angular/forms';

export function patternValidator(pattern): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return !pattern.test(value) ? {patternInvalid: {pattern}} : null;
  };
}
