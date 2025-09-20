import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
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
  template: ` <hlm-avatar>
    <img [src]="src()" [alt]="alt()" hlmAvatarImage />
    @if (displayFallback()) {
      <span class="bg-primary text-primary-foreground" hlmAvatarFallback>
        {{ fallback() }}
      </span>
    }
  </hlm-avatar>`,
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly fallback = input<string>('');

  protected readonly displayFallback = computed(() => {
    return !this.src() && this.fallback();
  });
}
