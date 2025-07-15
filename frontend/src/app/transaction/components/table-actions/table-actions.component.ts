import { Component, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
} from '@spartan-ng/helm/menu';
@Component({
  selector: 'app-table-actions',
  imports: [
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    NgIcon,
    HlmIconDirective,
  ],
  templateUrl: './table-actions.component.html',
  styleUrl: './table-actions.component.scss',
})
export class TableActionsComponent {
  readonly delete = output<void>();
  readonly edit = output<void>();
  readonly viewDetails = output<void>();

  onDelete() {
    this.delete.emit();
  }
  onViewDetails() {
    this.viewDetails.emit();
  }
}
