import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { StepInputs } from "../../models/workflow-models";

@Component({
  standalone: true,
  selector: "app-inputs-panel",
  imports: [],
  template: `
    <div style="border:1px solid #ddd; border-radius:10px; padding:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px;">
        <div style="font-weight:700">Step Inputs</div>

        <div style="display:flex; gap:8px; align-items:center;">
          <input
            type="file"
            accept="application/json,.json"
            (change)="onFilePicked($event)"
          />
        </div>
      </div>

      @if (!stepId) {
        <div style="opacity:.7;">Select a step to upload/view inputs.</div>
      } @else {
        <div style="font-size:12px; opacity:.7; margin-bottom:8px;">
          Upload a JSON file to set inputs for step #{{ stepId }}.
        </div>

        @if (!inputs || objectKeys(inputs).length === 0) {
          <div style="opacity:.7;">No inputs uploaded for this step yet.</div>
        } @else {
          <label style="font-size:12px; font-weight:600;">Inputs (read-only)</label>
          <textarea
            style="width:100%; height:140px; font-family:monospace;"
            [value]="stringify(inputs)"
            readonly
          ></textarea>
        }
      }
    </div>
  `,
})
export class InputsPanelComponent {
  /** selected step id (needed because inputs are step-scoped now) */
  @Input() stepId: number | null = null;

  /** inputs object returned by API: { inputs: {...} } */
  @Input() inputs: StepInputs = {};

  /** emit file to parent to call facade.uploadSelectedStepInput(file) */
  @Output() uploadInput = new EventEmitter<File>();

  onFilePicked(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // reset the native input so selecting same file again still triggers change
    input.value = "";

    this.uploadInput.emit(file);
  }

  stringify(v: unknown) {
    try {
      return JSON.stringify(v ?? {}, null, 2);
    } catch {
      return "{}";
    }
  }

  objectKeys(obj: Record<string, unknown>) {
    return Object.keys(obj ?? {});
  }
}
