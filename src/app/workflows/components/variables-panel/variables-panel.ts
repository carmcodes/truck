import {Component, EventEmitter, Input, Output} from '@angular/core';
import type {Id, StepDto} from '../../models/workflow-models';
import {WorkflowVar} from "../monaco-step-editor/workflow-vars";
import {DsButtonModule, DsCheckboxModule, DsFormFieldModule} from "@bmw-ds/components";

@Component({
  standalone: true,
  selector: 'app-variables-panel',
  imports: [
    DsFormFieldModule,
    DsButtonModule,
    DsCheckboxModule
  ],
  template: `
    <div style="border:1px solid #ddd; border-radius:12px; padding:12px; background:#fff;">
    <div style="grid-column: 1 / -1; margin-top:6px;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
        <div>
<!--          <div style="font-size:12px; font-weight:900;">Available Variables</div>-->
          <div style="display:flex; gap:8px; align-content: flex-start; justify-content: space-between">
            <div style="font-size:12px; font-weight:900;">Available Variables</div>-
            <ds-button
                type="button"
                style="font-size:12px;"
                (click)="selectAll()"
                [disabled]="!availableVariables?.length"
            >
              Select all
            </ds-button>
            <ds-button
                type="button"
                style="font-size:12px;"
                (click)="clearAll()"
                [disabled]="!includedOutputs?.length"
            >
              Clear
            </ds-button>
          </div>
          <div style="font-size:12px; opacity:.7; margin-top:2px;">
            Choose which available variables will be included in the step output display/export.
          </div>
          
        </div>

        
      </div>

      @if (!availableVariables || availableVariables.length === 0) {
        <div style="margin-top:10px; opacity:.7; font-size:12px; border:1px solid #ddd; border-radius:12px; padding:12px;">
          No variables available yet. Add inputs or declare variables in scripts.
        </div>
      } @else {
        <div style="margin-top:10px; border:1px solid #eee; border-radius:12px; padding:10px; max-height:180px; overflow:auto;">
          @for (v of availableVariables; track v) {
            <ds-form-field>
              <label ds-label style="display:flex; gap:8px; align-items:center; padding:6px 4px; border-bottom:1px solid #f3f3f3;">
                <input 
                       type="checkbox"
                       [checked]="isIncluded(v.name)"
                       (change)="toggleIncluded(v.name, $any($event.target).checked)"
                />

                <code>{{ ' ' + v.name }}</code>
              </label>
            </ds-form-field>
          }
        </div>

        <div style="font-size:12px; opacity:.7; margin-top:8px;">
          Selected: {{ includedOutputs?.length ?? 0 }} / {{ availableVariables.length }}
        </div>
      }
    </div>
    </div>
  `
})
export class VariablesPanelComponent {
  @Input() step: StepDto | null = null;
  @Input({required: true}) availableVariables: WorkflowVar[] = [];
  @Input() steps: StepDto[] = [];
  @Input() includedOutputs: string[] = [];
  @Output() patchStep = new EventEmitter<{ stepId: Id; patch: Partial<StepDto> }>();
  @Output() includedOutputsChange = new EventEmitter<{ stepId: Id; includedOutputs: string[] }>();

  selectAll() {
    if (!this.step) return;
    this.includedOutputsChange.emit({ stepId: this.step.id, includedOutputs: [...(this.availableVariables.map(value => value.name) ?? [])] });
  }

  clearAll() {
    if (!this.step) return;
    this.includedOutputsChange.emit({ stepId: this.step.id, includedOutputs: [] });
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
}
