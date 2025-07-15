import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  Signal,
} from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  CreateTransactionRequest,
  TransactionResponse,
  TransactionType,
} from '../../models';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmButtonDirective,
    TransactionFormComponent,
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class TransactionDialogComponent implements OnDestroy {
  private readonly dialogContext = injectBrnDialogContext<{
    type: TransactionType;
    mode: 'CREATE' | 'VIEW';
    loading: Signal<boolean>;
    transaction?: TransactionResponse;
    onSubmit: (request: CreateTransactionRequest) => Observable<void>;
  }>();
  private readonly dialogRef = inject<BrnDialogRef<unknown>>(BrnDialogRef);

  protected readonly type = this.dialogContext.type;
  protected readonly mode = this.dialogContext.mode;
  protected readonly transaction = this.dialogContext.transaction;

  protected readonly loading = computed(() =>
    this.dialogContext.loading ? this.dialogContext.loading() : false
  );

  protected readonly isReadonly = signal(false);

  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      if (this.mode === 'VIEW') {
        this.isReadonly.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get title() {
    if (this.mode === 'CREATE') {
      return 'Create Transaction';
    }

    return this.isReadonly() ? 'Update Transaction' : 'View Transaction';
  }

  onSubmitted(request: CreateTransactionRequest) {
    this.dialogContext
      .onSubmit(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.mode === 'CREATE') {
            this.dialogRef.close();
            return;
          }
          this.isReadonly.set(true);
        },
      });
  }

  onCanceled() {
    if (this.mode === 'VIEW') {
      this.isReadonly.set(true);
    }

    if (this.mode === 'CREATE') {
      this.dialogRef.close();
    }
  }

  onMakeEditable() {
    this.isReadonly.set(false);
  }
}
