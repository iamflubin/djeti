import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
import {
  CreateTransactionRequest,
  ExpenseCategory,
  TransactionResponse,
  TransactionType,
} from '../../models';

@Component({
  selector: 'app-transaction-form',
  imports: [
    ReactiveFormsModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
  readonly type = input.required<TransactionType>();
  readonly transaction = input<TransactionResponse>();
  readonly submitted = output<CreateTransactionRequest>();

  readonly buttonLabel = computed(() => {
    if (this.transaction()) {
      return 'Update Transaction';
    }
    return 'Save Transaction';
  });

  protected readonly loading = signal<boolean>(false);

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    title: ['', Validators.required],
    amount: [1, [Validators.required, Validators.min(1)]],
    date: [new Date(), Validators.required],
    category: this.fb.control<ExpenseCategory | undefined>(undefined),
  });

  get f() {
    return this.form.controls;
  }

  constructor() {
    effect(() => {
      const transaction = this.transaction();
      if (transaction) {
        this.form.patchValue({
          title: transaction.title,
          amount: transaction.amount,
          date: new Date(transaction.date),
          category: transaction.category ?? undefined,
        });
      }
    });

    effect(() => {
      if (this.type() === 'INCOME') {
        this.form.get('category')?.clearValidators();
      } else {
        this.form.get('category')?.setValidators(Validators.required);
      }
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);

    const { amount, category, date, title } = this.form.getRawValue();

    this.submitted.emit({
      title,
      amount,
      date: format(date, 'yyyy-MM-dd'),
      type: this.type(),
      category: category,
    });
  }
}
