import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
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
import { format, parseISO } from 'date-fns';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DATE_FORMAT } from '../../../core/constants/date.constants';
import { dateRangeValidator } from './date-range.validator';

@Component({
  selector: 'app-date-range-picker',
  imports: [HlmDatePickerComponent, ReactiveFormsModule],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent implements OnInit, OnDestroy {
  readonly initialRange = input<{ from: string; to: string }>();
  readonly rangeChange = output<{ from: string; to: string }>();

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
        distinctUntilChanged(),
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
    const initialRange = this.initialRange();
    if (initialRange) {
      this.form.patchValue({
        from: parseISO(initialRange.from),
        to: parseISO(initialRange.to),
      });
    }
  }

  private handleRangeChange() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { from, to } = this.form.getRawValue();
    this.rangeChange.emit({
      from: format(from, DATE_FORMAT),
      to: format(to, DATE_FORMAT),
    });
  }
}
