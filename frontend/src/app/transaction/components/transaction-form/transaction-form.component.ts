import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmDatePickerComponent } from '@spartan-ng/helm/date-picker';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import {
  HlmRadioComponent,
  HlmRadioGroupComponent,
  HlmRadioIndicatorComponent,
} from '@spartan-ng/helm/radio-group';
import { format } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import {
  CreateTransactionRequest,
  ExpenseCategory,
  TransactionType,
} from '../../models';
@Component({
  selector: 'app-transaction-form',
  imports: [
    HlmDatePickerComponent,
    HlmRadioComponent,
    HlmRadioGroupComponent,
    HlmRadioIndicatorComponent,
    ReactiveFormsModule,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit, OnDestroy {
  readonly loading = input<boolean>(false);
  readonly type = input.required<TransactionType>();
  readonly mode = input.required<'CREATE' | 'UPDATE' | 'VIEW'>();
  readonly transactionCreated = output<CreateTransactionRequest>();

  private readonly destroy$ = new Subject<void>();

  private readonly type$ = toObservable(this.type).pipe(
    takeUntil(this.destroy$)
  );

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    title: ['', Validators.required],
    description: this.fb.control<string | undefined>(undefined),
    amount: [1, [Validators.required, Validators.min(1)]],
    date: [new Date(), Validators.required],
    category: this.fb.control<ExpenseCategory | undefined>(undefined),
  });

  protected readonly submitButtonLabel = computed(() => {
    if (this.mode() === 'CREATE') {
      return 'Create Transaction';
    }
    if (this.mode() === 'UPDATE') {
      return 'Update Transaction';
    }
    return '';
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.type$.subscribe(type => {
      if (type === 'EXPENSE') {
        this.form.get('category')?.setValidators(Validators.required);
      } else {
        this.form.get('category')?.clearValidators();
      }
      this.form.get('category')?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value.description);

    const { amount, category, date, description, title } =
      this.form.getRawValue();

    if (this.mode() === 'CREATE') {
      this.transactionCreated.emit({
        title,
        amount,
        date: format(date, 'yyyy-MM-dd'),
        description: description ?? undefined, //Form control value is null if initial value is undefined even if using NonNullableFormBuilder. See https://github.com/angular/angular/issues/47027
        type: this.type(),
        category: category ?? undefined,
      });
      return;
    }
  }
}
