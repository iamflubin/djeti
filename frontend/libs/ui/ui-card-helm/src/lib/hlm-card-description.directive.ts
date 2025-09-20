import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmCardDescription]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCardDescriptionDirective {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm('text-sm text-muted-foreground', this.userClass())
  );
}
