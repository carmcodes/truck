import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { StepDto, Id } from "../../models/workflow-models";

@Component({
  standalone: true,
  selector: "app-steps-sidebar",
  imports: [],
  template: `
    <div style="border:1px solid #ddd; border-radius:10px; padding:10px; height:100%; overflow:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px;">
        <div style="font-weight:700">Steps</div>
        <button (click)="addStep.emit()">+ Add</button>
      </div>

      @for (s of steps; track s.id; let i = $index) {
        <div
          (click)="selectStep.emit(s.id)"
          [style.background]="s.id === selectedStepId ? '#f2f2f2' : 'transparent'"
          style="padding:10px; border-radius:10px; cursor:pointer; margin-bottom:6px; border:1px solid #eee;"
        >
          <div style="display:flex; justify-content:space-between; gap:8px; align-items:center;">
            <div>
              <div style="font-weight:600">{{ i + 1 }}. {{ s.name }}</div>
              <div style="font-size:12px; opacity:.7">
                {{ s.cacheable ? "cache" : "no-cache" }} • runnable: {{ s.runnable ? "yes" : "no" }}
              </div>
            </div>

            <!-- Backend only supports deleting the FINAL step -->
            @if (i === steps.length - 1) {
              <button (click)="onDeleteLast($event)" title="Delete last step">✕</button>
            }
          </div>
        </div>
      }

      @if (steps.length === 0) {
        <div style="opacity:.7;">No steps yet.</div>
      }
    </div>
  `,
})
export class StepsSidebarComponent {
  @Input({ required: true }) steps: StepDto[] = [];
  @Input() selectedStepId: Id | null = null;

  @Output() selectStep = new EventEmitter<Id>();
  @Output() addStep = new EventEmitter<void>();

  /**
   * New behavior: delete the final step only
   * (DELETE /api/Workflow/{workflowId}/Step)
   */
  @Output() deleteLastStep = new EventEmitter<void>();

  onDeleteLast(ev: MouseEvent) {
    ev.stopPropagation();
    this.deleteLastStep.emit();
  }
}
