import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmDatePickerComponent } from '@spartan-ng/helm/date-picker';
import { endOfMonth, startOfMonth } from 'date-fns';
import { debounceTime, startWith, Subject } from 'rxjs';
import { DATE_RANGE_STORAGE_KEY } from '../../../core/constants/storage.constants';
import { loadFromStorage, saveToStorage } from '../../../core/utils';
import { dateRangeValidator } from './date-range.validator';

@Component({
  selector: 'app-date-range-picker',
  imports: [HlmDatePickerComponent, ReactiveFormsModule],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent implements OnInit, OnDestroy {
  readonly rangeChange = output<{ from: Date; to: Date }>();

  private readonly fb = inject(NonNullableFormBuilder);

  private readonly destroy$ = new Subject<void>();

  protected readonly form = this.fb.group(
    {
      from: [new Date(), Validators.required],
      to: [new Date(), Validators.required],
    },
    {
      validators: [dateRangeValidator('from', 'to')],
    }
  );

  private readonly destroyRef = inject(DestroyRef);

  get f() {
    return this.form.controls;
  }

  get customClass() {
    return {
      'border-destructive': this.form.invalid && this.form.touched,
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.form.valueChanges
      .pipe(
        startWith(this.form.getRawValue()),
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200)
      )
      .subscribe(() => this.handleRangeChange());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    const persistedRange = loadFromStorage<{ from: Date; to: Date }>(
      DATE_RANGE_STORAGE_KEY
    );

    const now = new Date();
    const initialFrom = persistedRange
      ? new Date(persistedRange.from)
      : startOfMonth(new Date());
    const initialTo = persistedRange
      ? new Date(persistedRange.to)
      : endOfMonth(now);

    this.form.patchValue({ from: initialFrom, to: initialTo });
  }

  private handleRangeChange() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { from, to } = this.form.getRawValue();
    this.rangeChange.emit({ from, to });
    saveToStorage(DATE_RANGE_STORAGE_KEY, { from, to });
  }
}
