import { Component, computed, Signal } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import {
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { CreateTransactionRequest, TransactionType } from '../../models';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    TransactionFormComponent,
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class TransactionDialogComponent {
  private readonly dialogContext = injectBrnDialogContext<{
    type: TransactionType;
    mode: 'CREATE' | 'UPDATE' | 'VIEW';
    loading?: Signal<boolean>;
    onSubmit?: (request: CreateTransactionRequest) => void;
  }>();

  protected readonly type = this.dialogContext.type;
  protected readonly mode = this.dialogContext.mode;

  protected readonly loading = computed(() =>
    this.dialogContext.loading ? this.dialogContext.loading() : false
  );

  get title() {
    if (this.mode === 'CREATE') {
      return 'Create Transaction';
    }
    if (this.mode === 'UPDATE') {
      return 'Update Transaction';
    }
    return 'View Transaction';
  }

  onTransactionCreated(request: CreateTransactionRequest) {
    this.dialogContext.onSubmit?.(request);
  }
}
