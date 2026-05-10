import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import {
  ButtonComponent,
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
  InputDirective,
  LabelDirective,
  TextareaDirective,
} from '@/shared/ui';
import { SettingsService } from '@/application/state/settings.service';
import { ChatRepository } from '@/domain/ports/chat.repository';
import { ApiError } from '@/infrastructure/api/api-error';
import { PROVIDER_CATALOG } from '@/domain/catalog/provider.catalog';

type ConnectionStatus =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ok'; version: string; providers: string[] }
  | { kind: 'error'; message: string };

@Component({
  selector: 'app-settings-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    CardDescriptionComponent,
    CardHeaderComponent,
    CardTitleComponent,
    InputDirective,
    TextareaDirective,
    LabelDirective,
  ],
  host: { class: 'block min-h-full bg-muted/20' },
  template: `
    <div class="mx-auto flex min-h-full max-w-2xl flex-col gap-6 p-4 sm:p-8">
      <header class="flex items-center gap-3">
        <a appBtn variant="ghost" size="icon" routerLink="/" aria-label="Back">
          <ng-icon name="lucideArrowLeft" class="text-base" />
        </a>
        <div>
          <h1 class="text-xl font-semibold tracking-tight">Settings</h1>
          <p class="text-sm text-muted-foreground">Configure backend, auth and per-provider API keys.</p>
        </div>
      </header>

      <!-- Backend -->
      <app-card>
        <app-card-header>
          <app-card-title>Backend</app-card-title>
          <app-card-description>
            URL where notebook-backend is running. Used for all API calls.
          </app-card-description>
        </app-card-header>
        <app-card-content class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label appLabel for="baseUrl">Base URL</label>
            <input
              id="baseUrl"
              appInput
              type="url"
              [ngModel]="settings.baseUrl()"
              (ngModelChange)="settings.update({ baseUrl: $event })"
              placeholder="http://localhost:8080"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label appLabel for="token">Server auth token</label>
            <input
              id="token"
              appInput
              type="password"
              [ngModel]="settings.authToken()"
              (ngModelChange)="settings.update({ authToken: $event })"
              placeholder="Bearer token (only if backend has SERVER_AUTH_TOKEN set)"
              autocomplete="off"
            />
            <p class="text-xs text-muted-foreground">
              Leave blank for local dev when SERVER_AUTH_TOKEN is unset on the server.
            </p>
          </div>

          <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <button appBtn variant="outline" (click)="testConnection()" [disabled]="status().kind === 'loading'">
              @if (status().kind === 'loading') {
                <ng-icon name="lucideLoaderCircle" class="animate-spin text-base" />
              } @else {
                <ng-icon name="lucideCheck" class="text-base" />
              }
              Test connection
            </button>
            @switch (status().kind) {
              @case ('ok') {
                <span class="text-sm text-emerald-600 dark:text-emerald-400">
                  v{{ asOk().version }} — providers ready: {{ asOk().providers.join(', ') || 'none' }}
                </span>
              }
              @case ('error') {
                <span class="text-sm text-destructive">{{ asError().message }}</span>
              }
            }
          </div>
        </app-card-content>
      </app-card>

      <!-- Inference defaults -->
      <app-card>
        <app-card-header>
          <app-card-title>Inference</app-card-title>
          <app-card-description>System prompt and token budget applied to every chat request.</app-card-description>
        </app-card-header>
        <app-card-content class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label appLabel for="sysprompt">System prompt</label>
            <textarea
              id="sysprompt"
              appTextarea
              rows="4"
              [ngModel]="settings.settings().systemPrompt"
              (ngModelChange)="settings.update({ systemPrompt: $event })"
              placeholder="Optional. The backend uses a sensible default if blank."
            ></textarea>
          </div>
          <div class="flex flex-col gap-2">
            <label appLabel for="maxTokens">Max tokens</label>
            <input
              id="maxTokens"
              appInput
              type="number"
              min="1"
              [ngModel]="settings.settings().maxTokens"
              (ngModelChange)="onMaxTokensChange($event)"
            />
          </div>
        </app-card-content>
      </app-card>

      <!-- BYOK -->
      <app-card>
        <app-card-header>
          <app-card-title>Provider API keys (optional)</app-card-title>
          <app-card-description>
            Per-request keys. Override the server-side .env keys for that single call. Stored locally in your browser.
          </app-card-description>
        </app-card-header>
        <app-card-content class="flex flex-col gap-4">
          @for (p of providers; track p.id) {
            <div class="flex flex-col gap-2">
              <label appLabel [attr.for]="'key-' + p.id" class="flex items-center justify-between">
                <span>{{ p.label }}</span>
                <a [href]="p.apiKeyUrl" target="_blank" rel="noopener" class="text-xs text-primary underline-offset-4 hover:underline">
                  Get key
                </a>
              </label>
              <input
                [id]="'key-' + p.id"
                appInput
                type="password"
                autocomplete="off"
                [ngModel]="settings.settings().providerKeys[p.id] || ''"
                (ngModelChange)="settings.setProviderKey(p.id, $event)"
                [placeholder]="'Optional ' + p.label + ' API key'"
              />
            </div>
          }
        </app-card-content>
      </app-card>

      <!-- Reset -->
      <app-card>
        <app-card-header>
          <app-card-title>Reset</app-card-title>
          <app-card-description>Clears settings, conversation, and sources stored in this browser.</app-card-description>
        </app-card-header>
        <app-card-content>
          <button appBtn variant="destructive" (click)="onReset()">
            <ng-icon name="lucideTrash2" class="text-base" />
            Reset all local data
          </button>
        </app-card-content>
      </app-card>
    </div>
  `,
})
export class SettingsPageComponent {
  protected readonly settings = inject(SettingsService);
  private readonly chatRepo = inject(ChatRepository);
  protected readonly providers = PROVIDER_CATALOG;

  protected readonly status = signal<ConnectionStatus>({ kind: 'idle' });

  protected readonly asOk = computed(() =>
    this.status().kind === 'ok'
      ? (this.status() as Extract<ConnectionStatus, { kind: 'ok' }>)
      : { version: '', providers: [] as string[] },
  );
  protected readonly asError = computed(() =>
    this.status().kind === 'error'
      ? (this.status() as Extract<ConnectionStatus, { kind: 'error' }>)
      : { message: '' },
  );

  protected onMaxTokensChange(value: number | string): void {
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(n) && n > 0) {
      this.settings.update({ maxTokens: Math.floor(n) });
    }
  }

  protected async testConnection(): Promise<void> {
    this.status.set({ kind: 'loading' });
    try {
      const res = await firstValueFrom(this.chatRepo.health());
      this.status.set({
        kind: 'ok',
        version: res.version,
        providers: res.providers_configured,
      });
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : String(e);
      this.status.set({ kind: 'error', message: msg });
    }
  }

  protected onReset(): void {
    if (typeof window !== 'undefined' && !window.confirm('Reset all local data? This cannot be undone.')) {
      return;
    }
    this.settings.reset();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mastro-llm:notebook:v1');
      localStorage.removeItem('mastro-llm:theme');
    }
    this.status.set({ kind: 'idle' });
  }
}
