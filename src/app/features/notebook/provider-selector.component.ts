import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectDirective } from '@/shared/ui';
import { SettingsService } from '@/application/state/settings.service';
import { PROVIDER_CATALOG, findProvider } from '@/domain/catalog/provider.catalog';
import { Provider } from '@/domain/entities';

@Component({
  selector: 'app-provider-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SelectDirective],
  template: `
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div class="flex flex-col gap-1 flex-1">
        <label class="text-xs font-medium text-muted-foreground" for="provider">Provider</label>
        <select
          id="provider"
          appSelect
          [ngModel]="provider()"
          (ngModelChange)="onProviderChange($event)"
        >
          @for (p of providers; track p.id) {
            <option [value]="p.id">{{ p.label }}</option>
          }
        </select>
      </div>
      <div class="flex flex-col gap-1 flex-1">
        <label class="text-xs font-medium text-muted-foreground" for="model">Model</label>
        <select
          id="model"
          appSelect
          [ngModel]="model()"
          (ngModelChange)="onModelChange($event)"
        >
          @for (m of currentModels(); track m) {
            <option [value]="m">{{ m }}</option>
          }
        </select>
      </div>
    </div>
  `,
})
export class ProviderSelectorComponent {
  private readonly settings = inject(SettingsService);
  protected readonly providers = PROVIDER_CATALOG;
  protected readonly provider = this.settings.selectedProvider;
  protected readonly model = this.settings.selectedModel;
  protected readonly currentModels = computed(() => findProvider(this.provider()).models);

  protected onProviderChange(id: Provider): void {
    const info = findProvider(id);
    this.settings.update({
      selectedProvider: id,
      selectedModel: info.defaultModel,
    });
  }

  protected onModelChange(model: string): void {
    this.settings.update({ selectedModel: model });
  }
}
