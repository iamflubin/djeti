import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const BUDGET_RULE_VALIDATOR: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const group = control as FormGroup;

  if (group.invalid) {
    return null;
  }

  const { needs, wants, savings } = group.getRawValue();

  if (needs + wants + savings !== 100) {
    return { invalidRule: true };
  }

  return null;
};
