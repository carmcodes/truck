import {Component, EventEmitter, Input, Output, signal, OnChanges, SimpleChanges, OnDestroy} from "@angular/core";
import type { StepDto, Id } from "../../models/workflow-models";
import {WorkflowVar} from "../monaco-step-editor/workflow-vars";
import {DsCheckboxModule, DsFormFieldModule} from "@bmw-ds/components";

@Component({
  standalone: true,
  selector: "app-step-config-panel",
  imports: [
    DsFormFieldModule,
    DsCheckboxModule
  ],
  template: `
    <div style="border:1px solid #ddd; border-radius:10px; padding:10px;">
      <div style="font-weight:700; margin-bottom:8px;">Step Config</div>

      @if (!step) {
        <div style="opacity:.7;">Select a step to edit.</div>
      }

      @if (step) {
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <div style="grid-column: 1 / -1;">
            <ds-form-field>
              <label ds-label style="font-size:12px; font-weight:600;">Name</label>
              <input ds-input
                     style="width:100%;"
                     [value]="step.name"
                     (input)="emitPatch({ name: $any($event.target).value })"
              />
            </ds-form-field>
          </div>

          <div style="grid-column: 1 / -1;">
            <label ds-label style="font-size:12px; font-weight:800;">Alias</label>
            <input ds-input
                   style="width:100%; border: 1px solid; padding: 6px;"
                   [style.border-color]="aliasError() ? '#b00020' : '#ccc'"
                   [value]="currentAliasValue()"
                   (input)="handleAliasInput($any($event.target).value)"
            />
            <div style="font-size:12px; margin-top:6px; line-height:1.35;">
              @if(aliasError()){
                <span style="color: #b00020; font-weight: 600;">⚠ Alias cannot contain spaces. Use underscores or camelCase instead.</span>
              } @else {
                <span style="opacity:.7;">
                  This alias is used for namespacing inputs and outputs in run results:
                  <code style="background:#fafafa; padding:1px 6px; border-radius:8px; border:1px solid #eee;">
                    Inputs.{{ step.alias || "ALIAS" }}.*
                  </code>
                </span>
              }
            </div>
          </div>

          <div style="grid-column: 1 / -1;">
            <ds-form-field>
              <label ds-label style="font-size:12px; font-weight:600;">Description</label>
              <textarea ds-input
                        style="width:100%; height:70px;"
                        [value]="step.description"
                        (input)="emitPatch({ description: $any($event.target).value })"
              ></textarea>
            </ds-form-field>
          </div>

          <div>
            <ds-form-field>
              <label ds-label style="font-size:12px; font-weight:600;">Cacheable</label>
              <input
                type="checkbox"
                [checked]="step.cacheable"
                [disabled]="isUpdating()"
                (change)="handleCacheableChange($any($event.target).checked)"
              />
            </ds-form-field>
          </div>

          <div>
            <ds-form-field>
              <label ds-label style="font-size:12px; font-weight:600;">Runnable</label>
            </ds-form-field>
            <div style="font-size:12px; opacity:.75; margin-top:6px;">
              {{ step.runnable ? "Yes" : "No" }}
            </div>
          </div>

        </div>
      }
    </div>
  `,
})
export class StepConfigPanelComponent implements OnChanges, OnDestroy {
  @Input() step: StepDto | null = null;
  @Input() steps: StepDto[] = [];
  @Input() stepIndex : number = 0;
  @Output() patchStep = new EventEmitter<{ stepId: Id; patch: Partial<StepDto> }>();

  aliasError = signal<boolean>(false);
  currentAliasValue = signal<string>('');
  lastValidAlias = signal<string>('');

  isUpdating = signal<boolean>(false);
  private updateTimer: any;
  private currentStepId: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['step']) {
      if (this.step) {
        const alias = this.step.alias || '';
        this.currentAliasValue.set(alias);
        this.lastValidAlias.set(alias);
        this.aliasError.set(alias.includes(' '));

        // Reset updating flag when step changes
        if (this.currentStepId !== this.step.id) {
          this.currentStepId = this.step.id;
          this.isUpdating.set(false);
          clearTimeout(this.updateTimer);
        }
      } else {
        this.currentStepId = null;
        this.isUpdating.set(false);
      }
    }
  }

  ngOnDestroy() {
    clearTimeout(this.updateTimer);
  }

  handleAliasInput(value: string) {
    this.currentAliasValue.set(value);

    if (value.includes(' ')) {
      this.aliasError.set(true);
      return;
    }

    this.aliasError.set(false);

    if (value !== this.lastValidAlias()) {
      this.lastValidAlias.set(value);
      this.emitPatch({ alias: value });
    }
  }

  handleCacheableChange(checked: boolean) {
    if (!this.step || this.isUpdating()) return;

    console.log('🔘 Cacheable change:', {
      checked,
      stepCacheable: this.step.cacheable,
      isUpdating: this.isUpdating()
    });

    // Prevent rapid clicks
    this.isUpdating.set(true);

    // Clear any pending update
    clearTimeout(this.updateTimer);

    // Debounce the update
    this.updateTimer = setTimeout(() => {
      if (this.step && checked !== this.step.cacheable) {
        console.log('✅ Emitting cacheable patch:', checked);
        this.emitPatch({ cacheable: checked });
      }

      // Re-enable after a delay to allow backend to respond
      setTimeout(() => {
        this.isUpdating.set(false);
      }, 500);
    }, 100);
  }

  emitPatch(patch: Partial<StepDto>) {
    if (!this.step) return;
    console.log('📤 Emitting patch for step', this.step.id, ':', patch);
    this.patchStep.emit({ stepId: this.step.id, patch });
  }
}
