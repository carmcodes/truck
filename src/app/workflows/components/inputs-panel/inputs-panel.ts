import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output, signal,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {DsFormFieldModule, DsLabelModule} from "@bmw-ds/components";
import {WorkflowsFacade} from "../../services/workflows.facade";

@Component({
  standalone: true,
  selector: "app-inputs-panel",
  imports: [
    DsLabelModule,
    DsFormFieldModule
  ],
  template: `
      <div style="border:1px solid #ddd; border-radius:12px; padding:12px; background:#fff;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px;">
              <div>
                  <div style="font-weight:800">Inputs</div>
                  <div style="font-size:12px; opacity:.7;">
                      Upload JSON to make variables available to the workflow
                  </div>
              </div>

              <div style="display:flex; gap:8px; align-items:center;">
                <ds-form-field>
                  <input
                          type="file"
                          accept="application/json,.json,.txt"
                          [disabled]="isInputDisabled"
                          (change)="onFilePicked($event)"
                  />
                  </ds-form-field>
              </div>
          </div>

          @if (!stepId) {
              <div style="opacity:.7;">Select a step to upload inputs.</div>
          } @else {
              <div style="font-size:12px; opacity:.7; margin-bottom:10px; line-height:1.4;">
                  Uploaded inputs are parsed and become available in scripts.
                  In run results, they appear under:
                  <code style="background:#fafafa; padding:1px 6px; border-radius:8px; border:1px solid #eee;">
                      Inputs.{{ stepAlias || 'STEP_ALIAS' }}.*
                  </code>
              </div>

              <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
          <span style="font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid #e6e6e6; background:#fafafa;">
            Step: #{{ stepIndex ?? '-' }}
          </span>
                  @if (stepAlias) {
                      <span style="font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid #e6e6e6; background:#fafafa;">
              Alias: <code>{{ stepAlias }}</code>
            </span>
                  }
              </div>

              @if (!stepInputs || objectKeys(stepInputs).length === 0) {
                  <div style="opacity:.7;">No inputs uploaded yet.</div>
              } @else {
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                      <ds-form-field>
                          <ds-label style="font-size:12px; font-weight:700;">Available inputs (read-only)</ds-label>
                          <span style="font-size:12px; opacity:.6;">
              {{ objectKeys(stepInputs).length }} vars
            </span>
                      </ds-form-field>
                  </div>

                  <textarea
                          style="width:100%; height:160px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; font-size:12px; border-radius:10px; border:1px solid #eee; padding:10px;"
                          [value]="stringify(stepInputs)"
                          readonly
                  ></textarea>
              }
          }
      </div>
  `,
})
export class InputsPanelComponent {
  @Input() stepId: number | null = null;

  @Input() stepAlias: string | null = null;

  @Input() stepInputs: Record<string, unknown> = {};

  @Input() stepIndex: number | null = null;

  @Output() uploadInput = new EventEmitter<File>();
  @Output() clearInputs = new EventEmitter<void>();

  stepIdSig = signal<Number>;


  readonly facade = inject(WorkflowsFacade);

  onFilePicked(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

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

  get isInputDisabled(): boolean {
    return !this.stepId;
  }
}