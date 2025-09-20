import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmProgress],brn-progress[hlm]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmProgressDirective {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'relative inline-flex h-2 w-full overflow-hidden rounded-full bg-primary/20',
      this.userClass()
    )
  );
}
