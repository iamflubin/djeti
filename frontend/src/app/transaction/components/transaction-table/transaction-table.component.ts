import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmCheckboxComponent } from '@spartan-ng/helm/checkbox';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  ColumnDef,
  createAngularTable,
  flexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/angular-table';
import { TransactionResponse, TransactionType } from '../../models';
import { TableActionsComponent } from '../table-actions/table-actions.component';
import { TableHeadSortButtonComponent } from '../table-head-sort-button/table-head-sort-button.component';
@Component({
  selector: 'app-transaction-table',
  imports: [
    FormsModule,
    FlexRenderDirective,
    HlmButtonModule,
    BrnSelectModule,
    HlmSelectModule,
    ...HlmTableImports,
  ],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss',
})
export class TransactionTableComponent {
  readonly type = input.required<TransactionType>();
  readonly totalPages = input.required<number>();
  readonly transactions = input.required<TransactionResponse[]>();
  readonly pagination = model.required<PaginationState>();
  readonly rowSelection = model.required<RowSelectionState>();

  readonly delete = output<string[]>();
  readonly edit = output<string>();
  readonly viewDetails = output<string>();

  readonly sorting = signal<SortingState>([]);

  protected readonly availablePageSizes = [5, 10, 20, 10000];

  protected readonly columns: ColumnDef<TransactionResponse>[] = [
    {
      id: 'select',
      header: ({ table }) =>
        flexRenderComponent(HlmCheckboxComponent, {
          inputs: {
            checked: table.getIsAllRowsSelected(),
          },
          outputs: {
            changed: value => {
              table.toggleAllRowsSelected(!!value);
            },
          },
        }),
      cell: ({ row }) =>
        flexRenderComponent(HlmCheckboxComponent, {
          inputs: {
            checked: row.getIsSelected(),
          },
          outputs: {
            changed: value => {
              row.toggleSelected(!!value);
            },
          },
        }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: ({ column }) =>
        flexRenderComponent(TableHeadSortButtonComponent, {
          inputs: {
            column,
            label: 'Title',
          },
        }),
      cell: info => `
      <span class="block truncate max-w-[180px] font-medium">
        ${info.getValue()}
      </span>
    `,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) =>
        flexRenderComponent(TableHeadSortButtonComponent, {
          inputs: {
            column,
            label: 'Amount',
          },
        }),
      cell: info => {
        const value = info.getValue<number>();
        const color = value < 0 ? 'text-red-500' : 'text-green-600';
        return `
        <span class="${color}">
          $${value.toFixed(2)}
        </span>
      `;
      },
    },
    {
      id: 'date',
      accessorKey: 'date',
      header: ({ column }) =>
        flexRenderComponent(TableHeadSortButtonComponent, {
          inputs: {
            column,
            label: 'Date',
          },
        }),
      cell: info => {
        const value = info.getValue<string>();
        const formatted = new Date(value).toLocaleDateString();
        return `<span>${formatted}</span>`;
      },
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Category',
      cell: info => {
        const category = info.getValue();
        return `
        <span class="text-sm ${category ? 'text-gray-700' : 'text-gray-400 italic'}">
          ${category || 'Uncategorized'}
        </span>
      `;
      },
    },
    {
      id: 'actions',
      header: () => '',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) =>
        flexRenderComponent(TableActionsComponent, {
          outputs: {
            delete: () => this.delete.emit([row.original.id]),
            edit: () => this.edit.emit(row.original.id),
            viewDetails: () => this.viewDetails.emit(row.original.id),
          },
        }),
    },
  ];

  protected displayedColumns = computed<ColumnDef<TransactionResponse>[]>(
    () => {
      if (this.type() !== 'EXPENSE') {
        return this.columns.filter(column => column.id !== 'category');
      }
      return this.columns;
    }
  );

  protected readonly table = createAngularTable<TransactionResponse>(() => ({
    data: this.transactions(),
    columns: this.displayedColumns(),
    state: {
      pagination: this.pagination(),
      rowSelection: this.rowSelection(),
      sorting: this.sorting(),
    },
    pageCount: this.totalPages(),
    manualPagination: true,
    onPaginationChange: updaterOrValue => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      typeof updaterOrValue === 'function'
        ? this.pagination.update(updaterOrValue)
        : this.pagination.set(updaterOrValue);
    },
    onRowSelectionChange: updaterOrValue => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      typeof updaterOrValue === 'function'
        ? this.rowSelection.update(updaterOrValue)
        : this.rowSelection.set(updaterOrValue);
    },
    onSortingChange: updaterOrValue => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      typeof updaterOrValue === 'function'
        ? this.sorting.update(updaterOrValue)
        : this.sorting.set(updaterOrValue);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  }));

  onDeleteSelected() {
    const ids = this.table
      .getSelectedRowModel()
      .rows.map(row => row.original.id);
    this.delete.emit(ids);
  }
}
