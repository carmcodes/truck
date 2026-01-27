import {Component, EventEmitter, Input, Output, signal, SimpleChanges} from "@angular/core";
import type { StepDto, Id } from "../../models/workflow-models";
import {WorkflowVar} from "../monaco-step-editor/workflow-vars";

@Component({
  standalone: true,
  selector: "app-step-config-panel",
  imports: [
  ],
  template: `
    <div style="border:1px solid #ddd; border-radius:12px; padding:12px; background:#fff;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px;">
        <div>
          <div style="font-weight:900;">Step Config</div>
          @if (step) {
            <div style="font-size:12px; opacity:.7;">
              Step #{{ step.stepNumber }} • Runnable: <b>{{ step.runnable ? "Yes" : "No" }}</b>
            </div>
          }
        </div>

        @if (step) {
          <span style="font-size:12px; padding:2px 10px; border-radius:999px; border:1px solid #e6e6e6; background:#fafafa;">
            {{ step.cacheable ? "Cacheable" : "Not cacheable" }}
          </span>
        }
      </div>

      @if (!step) {
        <div style="opacity:.7;">Select a step to edit.</div>
      }

      @if (step) {
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <div style="grid-column: 1 / -1;">
            <label style="font-size:12px; font-weight:600;">Name</label>
            <input
              style="width:100%;"
              [value]="step.name"
              (input)="emitPatch({ name: $any($event.target).value })"
            />
          </div>

          <div style="grid-column: 1 / -1;">
            <label style="font-size:12px; font-weight:800;">Alias</label>
            <input
              style="width:100%; border: 1px solid; border-radius: 4px; padding: 6px;"
              [style.border-color]="aliasError() ? '#b00020' : '#ccc'"
              [value]="step.alias"
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
            <label style="font-size:12px; font-weight:800;">Description</label>
            <textarea
              style="width:100%; height:80px;"
              [value]="step.description"
              (input)="emitPatch({ description: $any($event.target).value })"
            ></textarea>
          </div>

          <div style="display:flex; gap:10px; align-items:center;">
            <input
              type="checkbox"
              [checked]="step.cacheable"
              (change)="emitPatch({ cacheable: $any($event.target).checked })"
            />
            <div>
              <div style="font-size:12px; font-weight:800;">Cacheable</div>
              <div style="font-size:12px; opacity:.7;">Reuse output if inputs didn't change</div>
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:800;">Runnable</div>
            <div style="font-size:12px; opacity:.75; margin-top:6px;">
              {{ step.runnable ? "Yes" : "No" }}
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class StepConfigPanelComponent {
  @Input() step: StepDto | null = null;
  @Input() steps: StepDto[] = [];
  @Output() patchStep = new EventEmitter<{ stepId: Id; patch: Partial<StepDto> }>();

  aliasError = signal<boolean>(false);
  currentAliasValue = signal<string>('');
  lastValidAlias = signal<string>('');

  ngOnChanges(changes: SimpleChanges) {
    // Sync the current alias value when step changes
    if (changes['step'] && this.step) {
      const alias = this.step.alias || '';
      this.currentAliasValue.set(alias);
      this.lastValidAlias.set(alias);
      this.aliasError.set(alias.includes(' '));
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

  handleAliasBlur() {
    // On blur, if there's an error, revert to last valid value
    if (this.aliasError()) {
      this.currentAliasValue.set(this.lastValidAlias());
      this.aliasError.set(false);
    }
  }

  emitPatch(patch: Partial<StepDto>) {
    if (!this.step) return;
    this.patchStep.emit({ stepId: this.step.id, patch });
  }
}
