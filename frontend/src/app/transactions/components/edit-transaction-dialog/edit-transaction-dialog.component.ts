import { Component } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import {
  HlmDialogDescriptionDirective,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { CreateTransactionRequest, TransactionResponse } from '../../models';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-edit-transaction-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    TransactionFormComponent,
  ],
  templateUrl: './edit-transaction-dialog.component.html',
  styleUrl: './edit-transaction-dialog.component.scss',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class EditTransactionDialogComponent {
  private readonly dialogContext = injectBrnDialogContext<{
    transaction: TransactionResponse;
    onEdit: (request: CreateTransactionRequest) => void;
  }>();

  protected readonly type = this.dialogContext.transaction.type;
  protected readonly transaction = this.dialogContext.transaction;

  onEdit(request: CreateTransactionRequest) {
    this.dialogContext.onEdit(request);
  }
}
