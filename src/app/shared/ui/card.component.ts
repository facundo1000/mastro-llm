import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
})
export class CardComponent {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('rounded-lg border bg-card text-card-foreground shadow-sm', this.className()),
  );
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
})
export class CardHeaderComponent {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex flex-col space-y-1.5 p-4 sm:p-6', this.className()),
  );
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
})
export class CardTitleComponent {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('text-lg font-semibold leading-none tracking-tight', this.className()),
  );
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
})
export class CardDescriptionComponent {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.className()),
  );
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
})
export class CardContentComponent {
  readonly className = input<string>('');
  protected readonly classes = computed(() => cn('p-4 pt-0 sm:p-6 sm:pt-0', this.className()));
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
})
export class CardFooterComponent {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex items-center p-4 pt-0 sm:p-6 sm:pt-0', this.className()),
  );
}
