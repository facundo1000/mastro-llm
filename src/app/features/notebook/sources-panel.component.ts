import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  CardTitleComponent,
  InputDirective,
  TextareaDirective,
} from '@/shared/ui';
import { NotebookStore } from '@/application/state/notebook.store';

@Component({
  selector: 'app-sources-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NgIcon,
    DecimalPipe,
    UpperCasePipe,
    ButtonComponent,
    BadgeComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    InputDirective,
    TextareaDirective,
  ],
  template: `
    <div class="flex h-full flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Sources</h2>
        @if (state.sources().length > 0) {
          <button appBtn variant="ghost" size="sm" (click)="state.clearSources()">
            <ng-icon name="lucideTrash2" class="text-base" />
            <span class="sr-only sm:not-sr-only">Clear</span>
          </button>
        }
      </div>

      <div class="flex flex-col gap-2">
        <button appBtn variant="outline" (click)="filePicker().nativeElement.click()" [disabled]="state.loading()">
          <ng-icon name="lucideUpload" class="text-base" />
          Upload PDF
        </button>
        <input
          #fp
          type="file"
          accept="application/pdf"
          class="hidden"
          (change)="onFile($event)"
        />

        <button appBtn variant="ghost" size="sm" (click)="textOpen.set(!textOpen())">
          <ng-icon [name]="textOpen() ? 'lucideX' : 'lucidePlus'" class="text-base" />
          {{ textOpen() ? 'Cancel' : 'Add text' }}
        </button>

        @if (textOpen()) {
          <div class="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
            <input
              appInput
              placeholder="Source name"
              [(ngModel)]="textName"
              class="text-sm"
            />
            <textarea
              appTextarea
              placeholder="Paste text…"
              rows="5"
              [(ngModel)]="textContent"
            ></textarea>
            <div class="flex justify-end gap-2">
              <button appBtn variant="ghost" size="sm" (click)="cancelText()">Cancel</button>
              <button appBtn size="sm" (click)="saveText()" [disabled]="!textContent.trim()">
                Save
              </button>
            </div>
          </div>
        }
      </div>

      <div class="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        @if (state.sources().length === 0) {
          <p class="text-sm text-muted-foreground">
            No sources yet. Upload a PDF or paste text — the model will use them as context.
          </p>
        }
        @for (s of state.sources(); track s.id) {
          <app-card class="!shadow-none">
            <app-card-header class="!p-3">
              <app-card-title class="text-sm flex items-center justify-between gap-2">
                <span class="flex items-center gap-2 truncate">
                  <ng-icon
                    [name]="s.type === 'pdf' ? 'lucideFileText' : 'lucideFile'"
                    class="text-base flex-shrink-0"
                  />
                  <span class="truncate">{{ s.name }}</span>
                </span>
                <button
                  appBtn
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7"
                  (click)="state.removeSource(s.id)"
                  aria-label="Remove source"
                >
                  <ng-icon name="lucideX" class="text-sm" />
                </button>
              </app-card-title>
            </app-card-header>
            <app-card-content class="!p-3 !pt-0 flex items-center gap-2">
              <app-badge variant="secondary">{{ s.type | uppercase }}</app-badge>
              @if (s.charCount !== undefined) {
                <span class="text-xs text-muted-foreground">
                  {{ s.charCount | number }} chars{{ s.pages ? ' · ' + s.pages + ' pages' : '' }}
                </span>
              }
            </app-card-content>
          </app-card>
        }
      </div>
    </div>
  `,
})
export class SourcesPanelComponent {
  protected readonly state = inject(NotebookStore);
  protected readonly filePicker = viewChild.required<ElementRef<HTMLInputElement>>('fp');

  protected readonly textOpen = signal(false);
  protected textName = '';
  protected textContent = '';

  protected async onFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      await this.state.addPdfSource(file);
    } finally {
      input.value = '';
    }
  }

  protected saveText(): void {
    const trimmed = this.textContent.trim();
    if (!trimmed) return;
    this.state.addTextSource(this.textName.trim() || `Note ${new Date().toLocaleString()}`, trimmed);
    this.cancelText();
  }

  protected cancelText(): void {
    this.textOpen.set(false);
    this.textName = '';
    this.textContent = '';
  }
}
