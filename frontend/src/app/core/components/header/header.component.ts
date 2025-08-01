import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/helm/menu';

import { NgIcon } from '@ng-icons/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { AuthService } from '../../../auth/services/auth.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    AvatarComponent,
    HlmMenuComponent,
    HlmMenuItemDirective,
    BrnMenuTriggerDirective,
    HlmButtonDirective,
    HlmIconDirective,
    NgIcon,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly initials = computed(() => {
    const user = this.authService.user();
    return !user
      ? ''
      : user.fullName
          .split(' ')
          .filter(word => word.length > 0)
          .map(word => word[0].toUpperCase())
          .join('');
  });

  protected readonly navItems = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Incomes', url: '/transactions/incomes' },
    { label: 'Expenses', url: '/transactions/expenses' },
  ];

  onLogout() {
    this.authService.logout().subscribe(async () => {
      await this.router.navigate(['auth', 'login']);
    });
  }
}
