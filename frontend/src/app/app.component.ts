import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly swUpdate = inject(SwUpdate);
  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          takeUntil(this.destroy$),
          filter(({ type }) => type === 'VERSION_READY')
        )
        .subscribe(() => {
          if (confirm('New version available. Load New Version?')) {
            window.location.reload();
          }
        });
    }
  }
}
