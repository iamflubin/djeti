import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { Column } from '@tanstack/angular-table';
import { TransactionResponse } from '../../models';

@Component({
  selector: 'app-table-head-sort-button',
  imports: [HlmButtonDirective, NgIcon, HlmIconDirective],
  templateUrl: './table-head-sort-button.component.html',
  styleUrl: './table-head-sort-button.component.scss',
})
export class TableHeadSortButtonComponent {
  readonly column = input.required<Column<TransactionResponse>>();
  readonly label = input.required<string>();

  onSort() {
    this.column().toggleSorting(this.column().getIsSorted() === 'asc');
  }
}
