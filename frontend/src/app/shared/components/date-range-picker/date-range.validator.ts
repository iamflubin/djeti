import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator =
  (fromKey = 'from', toKey = 'to'): ValidatorFn =>
  (group: AbstractControl): ValidationErrors | null => {
    const from = group.get(fromKey)?.value;
    const to = group.get(toKey)?.value;

    if (!from || !to) return null;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()))
      return { dateRange: 'Invalid date format' };

    return fromDate <= toDate
      ? null
      : { dateRange: 'Start date must be before end date' };
  };
