import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { parseISO } from 'date-fns';
import { formatDate, formatMoney } from '../../../core/utils';
import { TransactionResponse } from '../../models';
import { TransactionTableActionsComponent } from '../transaction-table-actions/transaction-table-actions.component';

export const TRANSACTION_COLUMNS: ColumnDef<TransactionResponse>[] = [
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatMoney(row.original.amount),
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(parseISO(row.original.date)),
  },
  {
    id: 'category',
    header: 'Category',
    accessorKey: 'category',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      flexRenderComponent(TransactionTableActionsComponent, {
        inputs: {
          transaction: row.original,
        },
      }),
  },
];
