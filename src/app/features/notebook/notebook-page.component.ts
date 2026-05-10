import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ButtonComponent, BadgeComponent } from '@/shared/ui';
import { ChatPanelComponent } from './chat-panel.component';
import { SourcesPanelComponent } from './sources-panel.component';
import { ProviderSelectorComponent } from './provider-selector.component';
import { NotebookStore } from '@/application/state/notebook.store';
import { SettingsService } from '@/application/state/settings.service';

@Component({
  selector: 'app-notebook-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgIcon,
    ButtonComponent,
    BadgeComponent,
    ChatPanelComponent,
    SourcesPanelComponent,
    ProviderSelectorComponent,
  ],
  host: { class: 'block h-full' },
  template: `
    <div class="flex h-full flex-col">
      <!-- Header -->
      <header
        class="flex h-14 flex-shrink-0 items-center gap-2 border-b border-border bg-background px-3 sm:px-4"
      >
        <button
          appBtn
          variant="ghost"
          size="icon"
          class="lg:hidden"
          (click)="toggleSidebar()"
          [attr.aria-label]="sidebarOpen() ? 'Close sources' : 'Open sources'"
        >
          <ng-icon [name]="sidebarOpen() ? 'lucideX' : 'lucideMenu'" class="text-base" />
        </button>

        <div class="flex flex-1 items-center gap-2 min-w-0">
          <span class="text-sm font-semibold tracking-tight">mastro-llm</span>
          @if (state.sources().length > 0) {
            <app-badge variant="secondary" class="hidden sm:inline-flex">
              {{ state.sources().length }} source{{ state.sources().length === 1 ? '' : 's' }}
            </app-badge>
          }
        </div>

        <button
          appBtn
          variant="ghost"
          size="icon"
          (click)="toggleTheme()"
          aria-label="Toggle theme"
        >
          <ng-icon [name]="isDark() ? 'lucideSun' : 'lucideMoon'" class="text-base" />
        </button>

        <a appBtn variant="ghost" size="icon" routerLink="/settings" aria-label="Settings">
          <ng-icon name="lucideSettings" class="text-base" />
        </a>
      </header>

      <!-- Layout principal -->
      <div class="relative flex flex-1 overflow-hidden">
        <!-- Sidebar overlay backdrop (mobile) -->
        @if (sidebarOpen()) {
          <button
            type="button"
            class="absolute inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close sources"
            (click)="closeSidebar()"
          ></button>
        }

        <!-- Sidebar de sources -->
        <aside
          [class]="
            'absolute inset-y-0 left-0 z-40 flex w-[85vw] max-w-sm flex-col gap-4 border-r border-border bg-background p-4 transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:w-80 lg:translate-x-0 ' +
            (sidebarOpen() ? 'translate-x-0' : '-translate-x-full')
          "
        >
          <app-provider-selector />
          <div class="border-t border-border pt-4 flex-1 overflow-hidden">
            <app-sources-panel />
          </div>
          <div class="border-t border-border pt-3 flex flex-col gap-2">
            <button
              appBtn
              variant="ghost"
              size="sm"
              (click)="state.clearMessages()"
              [disabled]="!state.hasMessages()"
            >
              <ng-icon name="lucideRefreshCw" class="text-base" />
              New conversation
            </button>
          </div>
        </aside>

        <!-- Chat -->
        <main class="flex flex-1 min-w-0 flex-col bg-muted/20">
          <app-chat-panel />
        </main>
      </div>
    </div>
  `,
})
export class NotebookPageComponent {
  protected readonly state = inject(NotebookStore);
  protected readonly settings = inject(SettingsService);

  protected readonly sidebarOpen = signal(false);
  protected readonly isDark = signal(this.detectInitialTheme());

  protected readonly sourceCountLabel = computed(() => {
    const n = this.state.sources().length;
    return `${n} source${n === 1 ? '' : 's'}`;
  });

  constructor() {
    this.applyTheme(this.isDark());
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected toggleTheme(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    this.applyTheme(next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mastro-llm:theme', next ? 'dark' : 'light');
    }
  }

  private applyTheme(dark: boolean): void {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', dark);
  }

  private detectInitialTheme(): boolean {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('mastro-llm:theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }
}
