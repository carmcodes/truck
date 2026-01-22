import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { StepsSidebarComponent } from "../../components/steps-sidebar/steps-sidebar";
import { StepConfigPanelComponent } from "../../components/step-config-panel/step-config-panel";
import { MonacoStepEditorComponent } from "../../components/monaco-step-editor/monaco-step-editor";
import { InputsPanelComponent } from "../../components/inputs-panel/inputs-panel";
import { VariablesPanelComponent } from "../../components/variables-panel/variables-panel";

import { WorkflowsFacade } from "../../services/workflows.facade";
import type { Id } from "../../models/workflow-models";

@Component({
  standalone: true,
  selector: "app-workflow-designer-page",
  imports: [
    StepsSidebarComponent,
    StepConfigPanelComponent,
    InputsPanelComponent,
    VariablesPanelComponent,
    MonacoStepEditorComponent,
  ],
  templateUrl: "./workflow-designer-page.html",
})
export class WorkflowDesignerPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly facade = inject(WorkflowsFacade);

  readonly workflow = computed(() => this.facade.workflow());
  readonly selectedStep = computed(() => this.facade.selectedStep());

  /** Export extension chosen by user (defaults to first export type once loaded) */
  readonly runExtension = signal<string>(".json");
  readonly availableVariableNamesForSelectedStep = computed(() =>
    this.availableVariablesForSelectedStep().map(v => v.name)
  );

  readonly isNew = computed(() => {
    const id = this.route.snapshot.paramMap.get("id");
    return !id;
  });

  async ngOnInit() {
    const raw = this.route.snapshot.paramMap.get("id");
    if (raw) {
      const id = Number(raw) as Id;
      await this.facade.loadWorkflow(id);
    } else {
      this.facade.initNewWorkflow();
      // For new workflows, export types can still be loaded (non-blocking)
    }

    // load export types for the Run dropdown
    await this.facade.loadExportTypes();
    const types = this.facade.exportTypes();
    if (types?.length) this.runExtension.set(types[0].extension);
  }

  async saveWorkflow() {
    await this.facade.saveWorkflow();
  }

  async saveScript() {
    // ✅ now uses facade script cache + includedOutputs
    await this.facade.saveSelectedStepScript();
  }

  async run() {
    if (this.facade.hasAnySyntaxErrors()) {
      this.facade.error.set(
        "Fix syntax errors before running. " + (this.facade.getFirstSyntaxError() ?? "")
      );
      return;
    }

    const wf = this.facade.workflow();
    if (!wf?.id) return;

    await this.facade.runWorkflow(this.runExtension());

    this.router.navigate(["/workflows", wf.id, "runs"]);
  }

  back() {
    this.router.navigate(["/workflows"]);
  }

  /** Used by template: avoid arrow functions in HTML */
  onStepSelected(stepId: Id) {
    this.facade.selectStep(stepId);

    // optional: ensure Monaco shows the saved draft buffer for this step
    // (Monaco will bind directly to facade.getStepScript in HTML)
  }

  /** Used by template */
  onCodeChange(code: string) {
    const step = this.selectedStep();
    if (!step) return;
    this.facade.onStepCodeChange(step.id, code);
  }
}
