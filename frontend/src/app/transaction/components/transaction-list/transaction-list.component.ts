import { Component, computed, inject, input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { toast } from 'ngx-sonner';
import { CreateTransactionRequest, TransactionType } from '../../models';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-transaction-list',
  imports: [HlmButtonDirective],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent {
  readonly type = input.required<TransactionType>();

  protected readonly buttonLabel = computed(() => {
    if (this.type() === 'EXPENSE') {
      return 'Add Expense';
    }
    return 'Add Income';
  });

  private readonly toastService = toast;
  private readonly dialogService = inject(HlmDialogService);
  private readonly transactionService = inject(TransactionService);

  onOpenCreationDialog() {
    const dialogRef = this.dialogService.open(TransactionDialogComponent, {
      context: {
        type: this.type(),
        mode: 'CREATE',
        loading: this.transactionService.loading,
        onSubmit: (request: CreateTransactionRequest) =>
          this.handleCreateTransaction(request, dialogRef),
      },
    });
  }

  private handleCreateTransaction = (
    request: CreateTransactionRequest,
    dialogRef: ReturnType<typeof this.dialogService.open>
  ) => {
    this.transactionService.createTransaction(request).subscribe({
      next: () => {
        this.toastService.success('Transaction created successfully');
        dialogRef.close(); // ✅ Close only on success
      },
      error: () => {
        this.toastService.error('Failed to create transaction');
      },
    });
  };
}
