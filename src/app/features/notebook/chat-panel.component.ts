import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import {
  ButtonComponent,
  TextareaDirective,
  CardComponent,
} from '@/shared/ui';
import { NotebookStore } from '@/application/state/notebook.store';
import { SettingsService } from '@/application/state/settings.service';
import { findProvider } from '@/domain/catalog/provider.catalog';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NgIcon,
    ButtonComponent,
    TextareaDirective,
    CardComponent,
  ],
  template: `
    <div class="flex h-full flex-col">
      <div #scroller class="flex-1 overflow-y-auto px-3 py-4 sm:px-6">
        @if (state.messages().length === 0) {
          <div class="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center">
            <div class="rounded-full border border-border bg-muted/40 p-4">
              <ng-icon name="lucideMessageSquare" class="text-3xl text-muted-foreground" />
            </div>
            <h3 class="mt-4 text-lg font-semibold">Ask anything about your sources</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              Currently using <strong class="text-foreground">{{ providerLabel() }}</strong>
              ({{ settings.selectedModel() }}).
              Add PDFs or notes from the sidebar and start the conversation below.
            </p>
          </div>
        }

        <div class="mx-auto flex max-w-3xl flex-col gap-4">
          @for (m of state.messages(); track m.id) {
            <app-card
              [class]="'flex gap-3 px-4 py-3 sm:px-5 ' +
                (m.role === 'user' ? 'bg-primary/5 border-primary/20' : '') +
                (m.error ? ' border-destructive/40 bg-destructive/5' : '')"
            >
              <div
                class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <ng-icon
                  [name]="m.role === 'user' ? 'lucideUser' : (m.error ? 'lucideCircleAlert' : 'lucideBot')"
                  class="text-base"
                />
              </div>
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <span class="text-xs font-medium text-muted-foreground">
                  {{ m.role === 'user' ? 'You' : (m.error ? 'Error' : providerLabel()) }}
                </span>
                <p class="whitespace-pre-wrap break-words text-sm leading-relaxed">{{ m.content }}</p>
              </div>
            </app-card>
          }

          @if (state.loading()) {
            <div class="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
              <ng-icon name="lucideLoaderCircle" class="animate-spin text-base" />
              Thinking…
            </div>
          }
        </div>
      </div>

      <form
        class="border-t border-border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:p-4"
        (submit)="onSubmit($event)"
      >
        <div class="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            appTextarea
            #ta
            rows="1"
            placeholder="Type your message… (Enter to send, Shift+Enter for newline)"
            [(ngModel)]="draft"
            name="draft"
            (keydown)="onKeyDown($event)"
            (input)="autoGrow($event)"
            class="max-h-40"
            [disabled]="state.loading()"
          ></textarea>
          <button
            appBtn
            type="submit"
            size="icon"
            [disabled]="state.loading() || !draft.trim()"
            aria-label="Send"
          >
            <ng-icon name="lucideSend" class="text-base" />
          </button>
        </div>
        @if (state.lastError(); as err) {
          <p class="mx-auto mt-2 max-w-3xl text-xs text-destructive">{{ err }}</p>
        }
      </form>
    </div>
  `,
})
export class ChatPanelComponent implements AfterViewChecked {
  protected readonly state = inject(NotebookStore);
  protected readonly settings = inject(SettingsService);

  protected readonly scroller = viewChild.required<ElementRef<HTMLDivElement>>('scroller');
  protected readonly textarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('ta');

  protected readonly providerLabel = computed(() => findProvider(this.settings.selectedProvider()).label);

  protected draft = '';

  /** Bandera para autoscroll en el próximo `ngAfterViewChecked`. */
  private readonly shouldScroll = signal(false);

  constructor() {
    // Cuando llegan mensajes nuevos o se prende loading, marcamos para hacer scroll abajo.
    effect(() => {
      // Trackear ambos signals.
      this.state.messages();
      this.state.loading();
      this.shouldScroll.set(true);
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll()) {
      const el = this.scroller().nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll.set(false);
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.send();
  }

  private send(): void {
    const content = this.draft;
    if (!content.trim() || this.state.loading()) return;
    this.draft = '';
    void this.state.sendMessage(content);
    queueMicrotask(() => {
      const ta = this.textarea().nativeElement;
      ta.style.height = 'auto';
    });
  }

  protected autoGrow(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }
}
