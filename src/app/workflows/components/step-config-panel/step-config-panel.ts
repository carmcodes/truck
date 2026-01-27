import {Component, EventEmitter, Input, Output, signal, OnChanges, SimpleChanges} from "@angular/core";
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
export class StepConfigPanelComponent implements OnChanges {
  @Input() step: StepDto | null = null;
  @Input() steps: StepDto[] = [];
  @Input() stepIndex : number = 0;
  @Output() patchStep = new EventEmitter<{ stepId: Id; patch: Partial<StepDto> }>();

  aliasError = signal<boolean>(false);
  currentAliasValue = signal<string>('');
  lastValidAlias = signal<string>('');

  lastCacheableValue = signal<boolean>(false);

  ngOnChanges(changes: SimpleChanges) {
    // Sync the current alias value when step changes
    if (changes['step'] && this.step) {
      const alias = this.step.alias || '';
      this.currentAliasValue.set(alias);
      this.lastValidAlias.set(alias);
      this.aliasError.set(alias.includes(' '));

      // ✅ Sync cacheable value from the step input
      this.lastCacheableValue.set(this.step.cacheable);
      console.log('🔄 Step changed, cacheable synced to:', this.step.cacheable);
    }
  }

  handleAliasInput(value: string) {
    // Update the displayed value immediately
    this.currentAliasValue.set(value);

    // Check for spaces
    if (value.includes(' ')) {
      this.aliasError.set(true);
      // Don't emit the patch - prevent backend error
      return;
    }

    // Clear error
    this.aliasError.set(false);

    // Only emit if the value has actually changed from the last valid value
    if (value !== this.lastValidAlias()) {
      this.lastValidAlias.set(value);
      this.emitPatch({ alias: value });
    }
  }

  handleCacheableChange(checked: boolean) {
    console.log('🔘 Cacheable toggle:', {
      newValue: checked,
      lastValue: this.lastCacheableValue(),
      stepCacheable: this.step?.cacheable
    });

    // Only emit if the value has actually changed from the step's current value
    if (this.step && checked !== this.step.cacheable) {
      console.log('✅ Emitting cacheable patch:', checked);
      this.lastCacheableValue.set(checked);
      this.emitPatch({ cacheable: checked });
    } else {
      console.log('⏭️ Skipping cacheable patch - no change');
    }
  }

  emitPatch(patch: Partial<StepDto>) {
    if (!this.step) return;
    console.log('📤 Emitting patch:', patch);
    this.patchStep.emit({ stepId: this.step.id, patch });
  }
}
