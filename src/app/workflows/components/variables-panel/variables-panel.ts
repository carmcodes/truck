import { Component, Input } from "@angular/core";
import type { StepDto } from "../../models/workflow-models";

@Component({
  standalone: true,
  selector: "app-variables-panel",
  imports: [],
  template: `
    <div style="border:1px solid #ddd; border-radius:12px; padding:12px; flex:1; overflow:auto; background:#fff;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px;">
        <div>
          <div style="font-weight:900;">Available Variables</div>
          <div style="font-size:12px; opacity:.7; margin-top:2px;">
            Usable inside the script (IDENTIFIER-compatible)
          </div>
        </div>

        @if (step) {
          <span style="font-size:12px; opacity:.7;">
            {{ availableVariables?.length ?? 0 }} vars
          </span>
        }
      </div>

      @if (!step) {
        <div style="opacity:.7;">Select a step to see available variables.</div>
      }

      @if (step) {
        <div style="font-size:12px; opacity:.7; margin-bottom:10px; line-height:1.4;">
          Variables are collected from uploaded JSON inputs and variables declared in scripts
          (previous steps + current step).
        </div>

        @if (!availableVariables || availableVariables.length === 0) {
          <div style="opacity:.7;">No variables detected.</div>
        } @else {
          <div style="display:flex; flex-direction:column; gap:6px;">
            @for (v of availableVariables; track v) {
              <div
                style="
                  padding:7px 10px;
                  border:1px solid #eee;
                  border-radius:12px;
                  background:#fafafa;
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  gap:10px;
                "
              >
                <code style="font-size:12px;">{{ v }}</code>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class VariablesPanelComponent {
  @Input() step: StepDto | null = null;

  /**
   * Expect raw IDENTIFIER-safe variable names:
   * - Var1
   * - total
   * - x
   * (No dots, because your grammar IDENTIFIER doesn't allow them)
   */
  @Input({ required: true }) availableVariables: string[] = [];
}
