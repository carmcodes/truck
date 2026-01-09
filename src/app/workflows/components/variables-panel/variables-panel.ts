import { Component, Input } from "@angular/core";
import type { StepDto } from "../../models/workflow-models";

@Component({
  standalone: true,
  selector: "app-variables-panel",
  imports: [],
  template: `
    <div style="border:1px solid #ddd; border-radius:10px; padding:10px; flex:1; overflow:auto;">
      <div style="font-weight:700; margin-bottom:8px;">Available Variables</div>

      @if (!step) {
        <div style="opacity:.7;">Select a step to see available variables.</div>
      }

      @if (step) {
        <div style="font-size:12px; opacity:.7; margin-bottom:8px;">
          Variables are derived from uploaded step inputs (via <code>/api/Step/input</code>).
        </div>

        @if (availableVariables.length === 0) {
          <div style="opacity:.7;">No variables detected.</div>
        }

        @for (v of availableVariables; track $index) {
          <div style="padding:6px 8px; border:1px solid #eee; border-radius:10px; margin-bottom:6px;">
            <code>{{ v }}</code>
          </div>
        }
      }
    </div>
  `,
})
export class VariablesPanelComponent {
  @Input() step: StepDto | null = null;

  /**
   * Expect values like:
   * - input.Var1
   * - step1.Var1   (if you choose to namespace per step in the parent)
   */
  @Input({ required: true }) availableVariables: string[] = [];
}
