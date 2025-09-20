import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import {
  HlmDialogDescriptionDirective,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { TransactionResponse, UpdateTransactionRequest } from '../../models';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-edit-transaction-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    TransactionFormComponent,
  ],
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Edit transaction</h3>
      <p hlmDialogDescription>Edit a transaction by filling out the form</p>
    </hlm-dialog-header>
    <app-transaction-form
      [type]="type"
      [transaction]="transaction"
      (submitted)="onEdit($event)" />
  `,
  styleUrl: './edit-transaction-dialog.component.scss',
  host: {
    class: 'flex flex-col gap-4',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTransactionDialogComponent {
  private readonly dialogContext = injectBrnDialogContext<{
    transaction: TransactionResponse;
    onEdit: (request: UpdateTransactionRequest) => void;
  }>();

  protected readonly type = this.dialogContext.transaction.type;
  protected readonly transaction = this.dialogContext.transaction;

  onEdit(request: UpdateTransactionRequest) {
    this.dialogContext.onEdit(request);
  }
}
