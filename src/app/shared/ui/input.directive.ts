import { Directive, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

const baseClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

@Directive({
  selector: 'input[appInput]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class InputDirective {
  readonly className = input<string>('');
  protected readonly classes = computed(() => cn(baseClass, this.className()));
}

@Directive({
  selector: 'textarea[appTextarea]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class TextareaDirective {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
      this.className(),
    ),
  );
}

@Directive({
  selector: 'label[appLabel]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class LabelDirective {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.className(),
    ),
  );
}
