import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  Updater,
} from '@tanstack/angular-table';
import { endOfMonth, startOfMonth } from 'date-fns';
import { toast } from 'ngx-sonner';
import { DateRangePickerComponent } from '../../../shared/components/date-range-picker/date-range-picker.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import {
  CreateTransactionRequest,
  QueryParams,
  TransactionResponse,
  TransactionType,
} from '../../models';
import { TransactionService } from '../../services/transaction.service';
import { CreateTransactionDialogComponent } from '../create-transaction-dialog/create-transaction-dialog.component';
import { TRANSACTION_COLUMNS } from './columns';

@Component({
  selector: 'app-transaction-table',
  imports: [
    FormsModule,
    FlexRenderDirective,
    HlmButtonModule,
    BrnSelectModule,
    HlmSelectModule,
    ...HlmTableImports,
    DateRangePickerComponent,
    PaginationComponent,
  ],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTableComponent {
  private readonly defaultPageSize = 10;
  private readonly defaultPageIndex = 0;

  readonly type = input.required<TransactionType>();

  private readonly transactionService = inject(TransactionService);
  private readonly dialogService = inject(HlmDialogService);
  private readonly toastService = toast;

  protected readonly loading = this.transactionService.loading;
  protected readonly totalElements = this.transactionService.totalElements;
  protected readonly totalPages = this.transactionService.totalPages;

  protected readonly pagination = signal<PaginationState>({
    pageIndex: this.defaultPageIndex,
    pageSize: this.defaultPageSize,
  });

  private dateRange: { from: Date; to: Date } = {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  };

  private readonly columns = computed(() => {
    if (this.type() === 'INCOME') {
      return TRANSACTION_COLUMNS.filter(column => column.id !== 'category');
    }
    return TRANSACTION_COLUMNS;
  });

  protected readonly table = createAngularTable<TransactionResponse>(() => ({
    data: this.transactionService.transactions(),
    columns: this.columns(),
    state: {
      pagination: this.pagination(),
    },
    pageCount: this.totalPages(),
    manualPagination: true,
    meta: {
      totalItems: this.totalElements(),
    },
    onPaginationChange: updaterOrValue =>
      this.handlePaginationChange(updaterOrValue),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  }));

  protected readonly addBtnLabel = computed(() =>
    this.type() === 'INCOME' ? 'Add Income' : 'Add Expense'
  );

  private readonly destroyRef = inject(DestroyRef);

  private fetchTransactions() {
    const params: QueryParams = {
      page: this.pagination().pageIndex,
      size: this.pagination().pageSize,
      type: this.type(),
      from: this.dateRange.from,
      to: this.dateRange.to,
    };
    this.transactionService.setParams(params);
    this.transactionService
      .getTransactions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private handlePaginationChange(updaterOrValue: Updater<PaginationState>) {
    if (typeof updaterOrValue === 'function') {
      this.pagination.update(updaterOrValue);
    } else {
      this.pagination.set(updaterOrValue);
    }
    this.fetchTransactions();
  }

  onRangeChange(range: { from: Date; to: Date }) {
    this.dateRange = range;
    this.pagination.set({
      pageIndex: this.defaultPageIndex,
      pageSize: this.defaultPageSize,
    });
    this.fetchTransactions();
  }

  onOpenAddDialog() {
    const ref = this.dialogService.open(CreateTransactionDialogComponent, {
      context: {
        type: this.type(),
        onCreate: (request: CreateTransactionRequest) => {
          this.transactionService
            .saveTransaction(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('Transaction saved successfully');
              },
              error: () => {
                this.toastService.error('Failed to save transaction');
              },
              complete: () => {
                ref.close();
              },
            });
        },
      },
    });
  }
}
