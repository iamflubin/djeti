import { Component, inject, OnDestroy, Signal } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmButtonDirective,
  ],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss',
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class ConfirmDeleteDialogComponent implements OnDestroy {
  private readonly dialogContext = injectBrnDialogContext<{
    loading: Signal<boolean>;
    onDelete: () => Observable<void>;
  }>();
  protected readonly loading = this.dialogContext.loading;
  private readonly dialogRef = inject<BrnDialogRef<unknown>>(BrnDialogRef);

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete() {
    this.dialogContext
      .onDelete()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
