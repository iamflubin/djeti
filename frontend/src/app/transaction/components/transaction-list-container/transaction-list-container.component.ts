import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { PaginationState, RowSelectionState } from '@tanstack/angular-table';
import { endOfMonth, startOfMonth } from 'date-fns';
import { toast } from 'ngx-sonner';
import {
  catchError,
  debounceTime,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  CreateTransactionRequest,
  TransactionQueryParams,
  TransactionResponse,
  TransactionType,
} from '../../models';
import { TransactionService } from '../../services/transaction.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';

@Component({
  selector: 'app-transaction-list-container',
  imports: [HlmButtonDirective, TransactionTableComponent],
  templateUrl: './transaction-list-container.component.html',
  styleUrl: './transaction-list-container.component.scss',
})
export class TransactionListContainerComponent implements OnInit, OnDestroy {
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
  private readonly destroy$ = new Subject<void>();

  protected readonly transactions = signal<TransactionResponse[]>([]);
  protected readonly selectedId = signal<string | null>(null);
  private readonly selectedTransaction = computed(() =>
    this.transactions().find(t => t.id === this.selectedId())
  );
  protected readonly totalPages = signal<number>(0);
  protected readonly loading = this.transactionService.loading;

  protected readonly rowSelection = signal<RowSelectionState>({});
  protected readonly pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  private readonly from = signal<Date>(startOfMonth(new Date()));
  private readonly to = signal<Date>(endOfMonth(new Date()));

  private readonly queryParams = computed<TransactionQueryParams>(() => ({
    page: this.pagination().pageIndex,
    size: this.pagination().pageSize,
    from: this.from(),
    to: this.to(),
    type: this.type(),
  }));

  private readonly queryParams$ = toObservable(this.queryParams);

  ngOnInit(): void {
    this.queryParams$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        switchMap(query => this.transactionService.getTransactions(query))
      )
      .subscribe({
        next: ({ content, totalPages }) => {
          this.setTransactionsData(content, totalPages);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onOpenCreationDialog() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.dialogService.open(TransactionDialogComponent, {
      context: {
        type: this.type(),
        mode: 'CREATE',
        loading: this.transactionService.loading,
        onSubmit: (request: CreateTransactionRequest) =>
          this.handleCreateTransaction(request),
      },
    });
  }

  onOpenViewDialog(transactionId: string) {
    this.openDialog('VIEW', transactionId);
  }

  onOpenDeleteConfirmDialog(ids: string[]) {
    this.dialogService.open(ConfirmDeleteDialogComponent, {
      context: {
        loading: this.transactionService.loading,
        onDelete: () => this.handleDeleteTransactions(ids),
      },
    });
  }

  private openDialog(mode: 'VIEW' | 'UPDATE', transactionId: string) {
    this.selectedId.set(transactionId);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.dialogService.open(TransactionDialogComponent, {
      context: {
        type: this.type(),
        mode,
        loading: this.transactionService.loading,
        transaction: this.selectedTransaction(),
        onSubmit: (request: CreateTransactionRequest) =>
          this.handleUpdateTransaction(request),
      },
    });
  }

  private handleCreateTransaction = (request: CreateTransactionRequest) => {
    return this.transactionService.createTransaction(request).pipe(
      switchMap(() =>
        this.transactionService.getTransactions(this.queryParams())
      ),
      tap(({ content, totalPages }) => {
        this.setTransactionsData(content, totalPages);
        this.toastService.success('Transaction created successfully');
      }),
      catchError(error => {
        this.toastService.error('Failed to create transaction');
        return throwError(() => error);
      })
    );
  };

  private handleUpdateTransaction = (request: CreateTransactionRequest) => {
    const selectedId = this.selectedId();
    if (!selectedId) {
      return;
    }
    return this.transactionService.updateTransaction(selectedId, request).pipe(
      switchMap(() =>
        this.transactionService.getTransactions(this.queryParams())
      ),
      tap(({ content, totalPages }) => {
        this.setTransactionsData(content, totalPages);
      }),
      catchError(error => {
        this.toastService.error('Failed to update transaction');
        return throwError(() => error);
      })
    );
  };

  private handleDeleteTransactions = (ids: string[]) => {
    return this.transactionService.deleteTransactions(ids).pipe(
      switchMap(() =>
        this.transactionService.getTransactions(this.queryParams())
      ),
      tap(({ content, totalPages }) => {
        this.toastService.success('Transactions deleted successfully');
        this.rowSelection.set({});
        this.setTransactionsData(content, totalPages);
      }),
      catchError(error => {
        this.toastService.error('Failed to delete transactions');
        return throwError(() => error);
      })
    );
  };

  private setTransactionsData(
    content: TransactionResponse[],
    totalPages: number
  ) {
    this.transactions.set(content);
    this.totalPages.set(totalPages);
  }
}
