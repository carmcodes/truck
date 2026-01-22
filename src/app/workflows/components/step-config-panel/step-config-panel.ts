import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { StepDto, Id } from "../../models/workflow-models";

@Component({
  standalone: true,
  selector: "app-step-config-panel",
  imports: [],
  template: `
    <div style="border:1px solid #ddd; border-radius:12px; padding:12px; background:#fff;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px;">
        <div>
          <div style="font-weight:900;">Step Config</div>
          @if (step) {
            <div style="font-size:12px; opacity:.7;">
              Step #{{ step.id }} • Runnable: <b>{{ step.runnable ? "Yes" : "No" }}</b>
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
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <!-- Name -->
          <div style="grid-column: 1 / -1;">
            <label style="font-size:12px; font-weight:800;">Name</label>
            <input
              style="width:100%; padding:8px 10px; border-radius:10px; border:1px solid #eee;"
              [value]="step.name"
              (input)="emitPatch({ name: $any($event.target).value })"
            />
          </div>

          <!-- Alias -->
          <div style="grid-column: 1 / -1;">
            <label style="font-size:12px; font-weight:800;">Alias</label>
            <input
              style="width:100%; padding:8px 10px; border-radius:10px; border:1px solid #eee;"
              [value]="step.alias"
              (input)="emitPatch({ alias: $any($event.target).value })"
            />
            <div style="font-size:12px; opacity:.7; margin-top:6px; line-height:1.35;">
              This alias is used for namespacing inputs and outputs in run results:
              <code style="background:#fafafa; padding:1px 6px; border-radius:8px; border:1px solid #eee;">
                Inputs.{{ step.alias || "ALIAS" }}.*
              </code>
            </div>
          </div>

          <!-- Description -->
          <div style="grid-column: 1 / -1;">
            <label style="font-size:12px; font-weight:800;">Description</label>
            <textarea
              style="width:100%; height:80px; padding:8px 10px; border-radius:10px; border:1px solid #eee;"
              [value]="step.description"
              (input)="emitPatch({ description: $any($event.target).value })"
            ></textarea>
          </div>

          <!-- Cacheable -->
          <div style="display:flex; gap:10px; align-items:center;">
            <input
              type="checkbox"
              [checked]="step.cacheable"
              (change)="emitPatch({ cacheable: $any($event.target).checked })"
            />
            <div>
              <div style="font-size:12px; font-weight:800;">Cacheable</div>
              <div style="font-size:12px; opacity:.7;">Reuse output if inputs didn’t change</div>
            </div>
          </div>

          <!-- Runnable -->
          <div>
            <div style="font-size:12px; font-weight:800;">Runnable</div>
            <div style="font-size:12px; opacity:.75; margin-top:6px;">
              {{ step.runnable ? "Yes" : "No" }}
            </div>
          </div>

          <!-- Included outputs selection -->
          <div style="grid-column: 1 / -1; margin-top:6px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
              <div>
                <div style="font-size:12px; font-weight:900;">Displayed output variables</div>
                <div style="font-size:12px; opacity:.7; margin-top:2px;">
                  Choose which available variables will be included in the step output display/export.
                </div>
              </div>

              <div style="display:flex; gap:8px;">
                <button
                  type="button"
                  style="font-size:12px;"
                  (click)="selectAll()"
                  [disabled]="!availableVariables?.length"
                >
                  Select all
                </button>
                <button
                  type="button"
                  style="font-size:12px;"
                  (click)="clearAll()"
                  [disabled]="!includedOutputs?.length"
                >
                  Clear
                </button>
              </div>
            </div>

            @if (!availableVariables || availableVariables.length === 0) {
              <div style="margin-top:10px; opacity:.7; font-size:12px;">
                No variables available yet. Add inputs or declare variables in scripts.
              </div>
            } @else {
              <div style="margin-top:10px; border:1px solid #eee; border-radius:12px; padding:10px; max-height:180px; overflow:auto;">
                @for (v of availableVariables; track v) {
                  <label style="display:flex; gap:8px; align-items:center; padding:6px 4px; border-bottom:1px solid #f3f3f3;">
                    <input
                      type="checkbox"
                      [checked]="isIncluded(v)"
                      (change)="toggleIncluded(v, $any($event.target).checked)"
                    />
                    <code>{{ v }}</code>
                  </label>
                }
              </div>

              <div style="font-size:12px; opacity:.7; margin-top:8px;">
                Selected: {{ includedOutputs?.length ?? 0 }} / {{ availableVariables.length }}
              </div>
            }
          </div>

          <div style="grid-column: 1 / -1; font-size:12px; opacity:.65; margin-top:4px;">
            Note: Dependencies / enabled flags are not supported by the current Step API.
          </div>
        </div>
      }
    </div>
  `,
})
export class StepConfigPanelComponent {
  @Input() step: StepDto | null = null;
  @Input() steps: StepDto[] = []; // kept for compatibility

  /** ✅ variables that can be selected for output display */
  @Input() availableVariables: string[] = [];

  /** ✅ current selection (persisted in facade per step) */
  @Input() includedOutputs: string[] = [];

  @Output() patchStep = new EventEmitter<{ stepId: Id; patch: Partial<StepDto> }>();

  /** ✅ notify parent to update facade selection */
  @Output() includedOutputsChange = new EventEmitter<{ stepId: Id; includedOutputs: string[] }>();

  emitPatch(patch: Partial<StepDto>) {
    if (!this.step) return;
    this.patchStep.emit({ stepId: this.step.id, patch });
  }

  isIncluded(v: string): boolean {
    return (this.includedOutputs ?? []).includes(v);
  }

  toggleIncluded(v: string, checked: boolean) {
    if (!this.step) return;

    const set = new Set(this.includedOutputs ?? []);
    if (checked) set.add(v);
    else set.delete(v);

    this.includedOutputsChange.emit({ stepId: this.step.id, includedOutputs: [...set] });
  }

  selectAll() {
    if (!this.step) return;
    this.includedOutputsChange.emit({ stepId: this.step.id, includedOutputs: [...(this.availableVariables ?? [])] });
  }

  clearAll() {
    if (!this.step) return;
    this.includedOutputsChange.emit({ stepId: this.step.id, includedOutputs: [] });
  }
}
