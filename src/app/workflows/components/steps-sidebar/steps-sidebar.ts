import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { StepDto, Id } from "../../models/workflow-models";
import {DsButtonModule, DsFormFieldComponent, DsFormFieldModule, DsInputMaskModule} from "@bmw-ds/components";

@Component({
  standalone: true,
  selector: "app-steps-sidebar",
  imports: [
    DsButtonModule, DsFormFieldModule, DsInputMaskModule
  ],
  template: `
    <div style="border:1px solid #ddd; border-radius:12px; padding:12px; height:100%; overflow:auto; background:#fff;">
      <ds-form-field>
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px;">
        <div>
          <div style="font-weight:900;">Steps</div>
        </div>
        <ds-button (click)="addStep.emit()" style="padding:6px 10px;">
          + Add
        </ds-button>
      </div>

      @if (steps.length === 0) {
        <div style="opacity:.7; padding:10px; border:1px dashed #e6e6e6; border-radius:12px;">
          No steps yet. Click <b>+ Add</b> to create your first step.
        </div>
      } @else {
        @for (s of steps; track s.id; let i = $index) {
          <div
              (click)="selectStep.emit(s.id)"
              style="
              padding:10px;
              border-radius:12px;
              cursor:pointer;
              margin-bottom:8px;
              border:1px solid #eee;
              background:#fff;
              transition: background .12s ease;
            "
              [style.background]="s.id === selectedStepId ? '#f7f7f7' : '#fff'"
              [style.borderLeft]="s.id === selectedStepId ? '4px solid #111' : '4px solid transparent'"
          >
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
              <div style="min-width:0;">
                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                  <div style="font-weight:800; white-space:nowrap;">
                    {{ i + 1 }}. {{ s.name }}
                  </div>

                  <span
                      style="font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid #e6e6e6; background:#fafafa;"
                      [style.opacity]="s.runnable ? '1' : '.65'"
                      title="Step is runnable only after script is uploaded"
                  >
                    {{ s.runnable ? "Runnable" : "Not runnable" }}
                  </span>

                  <span
                      style="font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid #e6e6e6; background:#fafafa;"
                      title="If enabled, backend may reuse output when inputs don't change"
                  >
                    {{ s.cacheable ? "Cacheable" : "No cache" }}
                  </span>
                </div>

                <div style="font-size:12px; opacity:.75; margin-top:6px; display:flex; gap:10px; flex-wrap:wrap;">
                  <span>
                    Alias:
                    <code style="background:#fafafa; padding:1px 6px; border-radius:8px; border:1px solid #eee;">
                      {{ s.alias || "—" }}
                    </code>
                  </span>
                </div>
              </div>

              @if (i === steps.length - 1) {
                <ds-button
                    (click)="onDeleteLast($event)"
                    title="Delete last step"
                    style="padding:6px 10px;"
                >
                  ✕
                </ds-button>
              } @else {
                <span style="font-size:12px; opacity:.35; padding:6px 10px;" title="Only last step can be deleted">
                  ✕
                </span>
              }
            </div>
          </div>
        }
      }
      </ds-form-field>
    </div>
  `,
})
export class StepsSidebarComponent {
  @Input({ required: true }) steps: StepDto[] = [];
  @Input() selectedStepId: Id | null = null;
  @Input() stepIndex: number | null = null;

  @Output() selectStep = new EventEmitter<Id>();
  @Output() addStep = new EventEmitter<void>();

  @Output() deleteLastStep = new EventEmitter<void>();

  onDeleteLast(ev: MouseEvent) {
    ev.stopPropagation();
    this.deleteLastStep.emit();
  }
}