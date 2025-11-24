import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isAfter } from 'date-fns';

export const dateRangeValidator =
  (fromKey = 'from', toKey = 'to'): ValidatorFn =>
  (group: AbstractControl): ValidationErrors | null => {
    const from = group.get(fromKey)?.value;
    const to = group.get(toKey)?.value;

    if (!from || !to) return null;

    if (isNaN(from.getTime()) || isNaN(to.getTime()))
      return { dateRange: 'Invalid date format' };

    return isAfter(from, to)
      ? { dateRange: 'Start date must be before end date' }
      : null;
  };
