import {Component, computed, inject, signal, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {StepsSidebarComponent} from '../../components/steps-sidebar/steps-sidebar';
import {StepConfigPanelComponent} from '../../components/step-config-panel/step-config-panel';
import {MonacoStepEditorComponent} from '../../components/monaco-step-editor/monaco-step-editor';
import {InputsPanelComponent} from '../../components/inputs-panel/inputs-panel';
import {VariablesPanelComponent} from '../../components/variables-panel/variables-panel';

import {WorkflowsFacade} from '../../services/workflows.facade';
import type {Id} from '../../models/workflow-models';
import {WorkflowVar} from '../../components/monaco-step-editor/workflow-vars';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-workflow-designer-page',
  imports: [
    StepsSidebarComponent,
    StepConfigPanelComponent,
    InputsPanelComponent,
    VariablesPanelComponent,
    MonacoStepEditorComponent,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './workflow-designer-page.html'
})
export class WorkflowDesignerPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly facade = inject(WorkflowsFacade);
  textArea = new FormControl('');
  readonly workflow = computed(() => this.facade.workflow());
  readonly selectedStep = computed(() => this.facade.selectedStep());
  readonly runExtension = signal<string>(".json");

  readonly isNew = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return !id;
  });

  readonly editorCode = signal<string>('');

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

    await this.facade.loadExportTypes();
    const types = this.facade.exportTypes();
    if (types?.length) this.runExtension.set(types[0].extension);
  }

  async saveWorkflow() {
    await this.facade.saveWorkflow();
  }

  async saveScript() {
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

  onStepSelected(stepId: Id) {
    this.facade.selectStep(stepId);
  }

  onCodeChange(code: string) {
    const step = this.selectedStep();
    if (!step) return;
    this.facade.onStepCodeChange(step.id, code);
  }
}
