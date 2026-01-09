import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { StepDto, Id } from "../../models/workflow-models";

@Component({
  standalone: true,
  selector: "app-step-config-panel",
  imports: [],
  template: `
    <div style="border:1px solid #ddd; border-radius:10px; padding:10px;">
      <div style="font-weight:700; margin-bottom:8px;">Step Config</div>

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
            <label style="font-size:12px; font-weight:600;">Description</label>
            <textarea
              style="width:100%; height:70px;"
              [value]="step.description"
              (input)="emitPatch({ description: $any($event.target).value })"
            ></textarea>
          </div>

          <div>
            <label style="font-size:12px; font-weight:600;">Cacheable</label>
            <input
              type="checkbox"
              [checked]="step.cacheable"
              (change)="emitPatch({ cacheable: $any($event.target).checked })"
            />
          </div>

          <div>
            <label style="font-size:12px; font-weight:600;">Runnable</label>
            <div style="font-size:12px; opacity:.75; margin-top:6px;">
              {{ step.runnable ? "Yes" : "No" }}
            </div>
          </div>

          <div style="grid-column: 1 / -1; font-size:12px; opacity:.7; margin-top:4px;">
            Note: Dependencies / enabled flags are not supported by the current Step API.
          </div>
        </div>
      }
    </div>
  `,
})
export class StepConfigPanelComponent {
  @Input() step: StepDto | null = null;

  // kept for compatibility with parent templates even if unused now
  @Input() steps: StepDto[] = [];

  @Output() patchStep = new EventEmitter<{ stepId: Id; patch: Partial<StepDto> }>();

  emitPatch(patch: Partial<StepDto>) {
    if (!this.step) return;
    this.patchStep.emit({ stepId: this.step.id, patch });
  }
}
