import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { StepsSidebarComponent } from "../../components/steps-sidebar/steps-sidebar";
import { StepConfigPanelComponent } from "../../components/step-config-panel/step-config-panel";
import { MonacoStepEditorComponent } from "../../components/monaco-step-editor/monaco-step-editor";
import { InputsPanelComponent } from "../../components/inputs-panel/inputs-panel";
import { VariablesPanelComponent } from "../../components/variables-panel/variables-panel";

import { WorkflowsFacade } from "../../services/workflows.facade";
import type { Id } from "../../models/workflow-models";
import {WorkflowVar} from '../../components/monaco-step-editor/workflow-vars';

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

  readonly isNew = computed(() => {
    const id = this.route.snapshot.paramMap.get("id");
    return !id;
  });

  /** Local editor buffer (StepDto doesn't include script anymore) */
  readonly editorCode = signal<string>("");

  /** Very simple variables list derived from selected step inputs */
  readonly availableVariableNames = computed(() => {
    const vars = this.facade.availableVariablesForSelectedStep() ?? [];
    return vars.map((v: WorkflowVar) => v.name);
  });


  async ngOnInit() {
    const raw = this.route.snapshot.paramMap.get("id");
    if (raw) {
      const id = Number(raw) as Id;
      await this.facade.loadWorkflow(id);
    } else {
      this.facade.initNewWorkflow();
    }
  }

  async saveWorkflow() {
    await this.facade.saveWorkflow();
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

    const extension = "json"; // or bind a dropdown in UI
    await this.facade.runWorkflow(extension);

    this.router.navigate(["/workflows", wf.id, "runs"]);
  }


  async saveScript() {
    // uploads script for currently selected step
    await this.facade.uploadSelectedStepScript(this.editorCode());
  }

  back() {
    this.router.navigate(["/workflows"]);
  }
}
