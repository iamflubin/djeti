import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  HlmPaginationContentDirective,
  HlmPaginationDirective,
  HlmPaginationItemDirective,
  HlmPaginationLinkDirective,
  HlmPaginationNextComponent,
  HlmPaginationPreviousComponent,
} from '@spartan-ng/helm/pagination';
import { Table } from '@tanstack/angular-table';

@Component({
  selector: 'app-pagination',
  imports: [
    HlmPaginationDirective,
    HlmPaginationContentDirective,
    HlmPaginationItemDirective,
    HlmPaginationPreviousComponent,
    HlmPaginationNextComponent,
    HlmPaginationLinkDirective,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent<T> {
  readonly table = input.required<Table<T>>();

  protected readonly pageIndex = computed(() => {
    return this.table().getState().pagination.pageIndex;
  });

  protected readonly pageCount = computed(() => {
    return this.table().getPageCount();
  });

  get totalItems(): number {
    const meta = this.table().options.meta as
      | { totalItems: number }
      | undefined;
    return meta?.totalItems ?? 0;
  }

  protected readonly pages = computed<number[]>(() => {
    const totalPages = this.pageCount();
    const current = this.pageIndex() + 1;
    const maxVisible = 5;

    // Show all pages if less than or equal to max
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = current - half;
    let end = current + half;

    // Adjust if near start
    if (start < 1) {
      start = 1;
      end = maxVisible;
    }

    // Adjust if near end
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  onGoToPage(page: number) {
    this.table().setPageIndex(page - 1);
  }

  onGoToPreviousPage() {
    if (this.pageIndex() > 0) {
      this.table().previousPage();
    }
  }

  onGoToNextPage() {
    if (this.pageIndex() + 1 < this.pageCount()) {
      this.table().nextPage();
    }
  }
}
