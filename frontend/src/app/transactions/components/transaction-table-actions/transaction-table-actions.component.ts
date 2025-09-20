import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { toast } from 'ngx-sonner';
import { TransactionResponse, UpdateTransactionRequest } from '../../models';
import { TransactionService } from '../../services/transaction.service';
import { EditTransactionDialogComponent } from '../edit-transaction-dialog/edit-transaction-dialog.component';

@Component({
  selector: 'app-transaction-table-actions',
  imports: [HlmButtonDirective],
  template: `
    <div class="flex gap-2">
      <button hlmBtn variant="secondary" (click)="onOpenEditDialog()">
        Edit
      </button>
      <button hlmBtn variant="destructive" (click)="onDelete()">Delete</button>
    </div>
  `,
  styleUrl: './transaction-table-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTableActionsComponent {
  readonly transaction = input.required<TransactionResponse>();
  private readonly dialogService = inject(HlmDialogService);
  private readonly transactionService = inject(TransactionService);
  private readonly toastService = toast;

  private readonly destroyRef = inject(DestroyRef);

  onOpenEditDialog() {
    const ref = this.dialogService.open(EditTransactionDialogComponent, {
      context: {
        transaction: this.transaction(),
        onEdit: (request: UpdateTransactionRequest) => {
          this.editTransaction(request, ref);
        },
      },
    });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService
        .deleteTransaction(this.transaction().id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.success('Transaction deleted successfully');
          },
          error: () => {
            this.toastService.error('Failed to delete transaction');
          },
        });
    }
  }

  private editTransaction(
    request: UpdateTransactionRequest,
    dialogRef: BrnDialogRef<unknown>
  ) {
    this.transactionService
      .updateTransaction(this.transaction().id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Transaction updated successfully');
        },
        error: () => {
          this.toastService.error('Failed to update transaction');
        },
        complete: () => {
          dialogRef.close();
        },
      });
  }
}
