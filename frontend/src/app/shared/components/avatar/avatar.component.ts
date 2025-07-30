import { Component, computed, input } from '@angular/core';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/helm/avatar';
@Component({
  selector: 'app-avatar',
  imports: [
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarFallbackDirective,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly fallback = input<string>('');

  protected readonly displayFallback = computed(() => {
    return !this.src() && this.fallback();
  });
}
