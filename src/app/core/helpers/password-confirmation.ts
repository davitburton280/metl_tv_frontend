import {FormGroup} from '@angular/forms';

export function passwordConfirmation(key: string, confirmationKey: string) {
  return (group: FormGroup) => {
    const input = group.controls[key];
    const confirmationInput = group.controls[confirmationKey];

    if (!input.value || !confirmationInput.value) {
      return;
    }

    return confirmationInput.setErrors(
      input.value !== confirmationInput.value ? {notMatch: true} : null
    );
  };
}
