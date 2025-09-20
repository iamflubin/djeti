import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'hlm-select-value,[hlmSelectValue], brn-select-value[hlm]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSelectValueDirective {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'w-[calc(100%)]] pointer-events-none !inline-block min-w-0 truncate border-border data-[placeholder]:text-muted-foreground ltr:text-left rtl:text-right',
      this.userClass()
    )
  );
}
