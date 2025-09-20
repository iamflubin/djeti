import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import {
  HlmDialogDescriptionDirective,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { CreateTransactionRequest, TransactionType } from '../../models';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-create-transaction-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    TransactionFormComponent,
  ],
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Save transaction</h3>
      <p hlmDialogDescription>Save a new transaction by filling out the form</p>
    </hlm-dialog-header>
    <app-transaction-form [type]="type" (submitted)="onCreate($event)" />
  `,
  styleUrl: './create-transaction-dialog.component.scss',
  host: {
    class: 'flex flex-col gap-4',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTransactionDialogComponent {
  private readonly dialogContext = injectBrnDialogContext<{
    type: TransactionType;
    onCreate: (request: CreateTransactionRequest) => void;
  }>();

  protected readonly type = this.dialogContext.type;

  onCreate(request: CreateTransactionRequest) {
    this.dialogContext.onCreate(request);
  }
}
