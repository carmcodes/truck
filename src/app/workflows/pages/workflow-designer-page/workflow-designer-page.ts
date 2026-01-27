import { Component, computed, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkflowsFacade } from '../../services/workflows.facade';
import { StepsSidebarComponent } from '../../components/steps-sidebar/steps-sidebar.component';
import { StepConfigPanelComponent } from '../../components/step-config-panel/step-config-panel.component';
import { MonacoStepEditorComponent } from '../../components/monaco-step-editor/monaco-step-editor.component';
import { InputsPanelComponent } from '../../components/inputs-panel/inputs-panel.component';
import { VariablesPanelComponent } from '../../components/variables-panel/variables-panel.component';
import type { Id } from '../../models/workflow-models';

@Component({
  standalone: true,
  selector: 'app-workflow-designer-page',
  imports: [
    CommonModule,
    StepsSidebarComponent,
    StepConfigPanelComponent,
    MonacoStepEditorComponent,
    InputsPanelComponent,
    VariablesPanelComponent
  ],
  templateUrl: './workflow-designer-page.html'
})
export class WorkflowDesignerPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly facade = inject(WorkflowsFacade);

  readonly workflowId = computed(() => Number(this.route.snapshot.paramMap.get('id')) as Id);
  readonly runExtension = signal<string>('.json');

  constructor() {
    effect(() => {
      const step = this.facade.selectedStep();
      console.log('👁️ Selected step changed in designer:', step?.id);
    });

    const id = this.workflowId();
    if (id && id > 0) {
      this.facade.loadWorkflow(id);
    } else {
      this.facade.initNewWorkflow();
    }

    this.facade.loadExportTypes();
  }

  back() {
    this.router.navigate(['/workflows']);
  }

  saveWorkflow() {
    this.facade.saveWorkflow();
  }

  onStepSelected(stepId: Id) {
    this.facade.selectStep(stepId);
  }

  onCodeChange(code: string) {
    const step = this.facade.selectedStep();
    if (step) {
      this.facade.onStepCodeChange(step.id, code);
    }
  }

  saveScript() {
    this.facade.saveSelectedStepScript();
  }

  isScriptSaved(): boolean {
    const step = this.facade.selectedStep();
    if (!step) return false;
    return this.facade.isStepScriptSaved(step.id);
  }

  unlockScript() {
    const step = this.facade.selectedStep();
    if (!step) return;

    if (confirm('Are you sure you want to unlock this script for editing? You will need to save it again before running.')) {
      this.facade.unlockStepScript(step.id);
    }
  }

  hasScriptErrors(): boolean {
    const step = this.facade.selectedStep();
    if (!step) return false;

    const errors = this.facade.stepSyntaxErrors()[step.id] ?? [];
    console.log('🔍 Checking errors for step', step.id, ':', errors);
    return errors.length > 0;
  }

  async run() {
    await this.facade.runWorkflow(this.runExtension());

    // Navigate to runs page after workflow completes
    const wf = this.facade.workflow();
    if (wf?.id) {
      this.router.navigate(['/workflows', wf.id, 'runs']);
    }
  }

  canRun(): boolean {
    const wf = this.facade.workflow();
    if (!wf?.id) return false;

    // Don't allow running if already running
    if (this.facade.running()) {
      return false;
    }

    // Check for syntax errors
    if (this.facade.hasAnySyntaxErrors()) {
      return false;
    }

    // Check if all steps with scripts have saved them
    const steps = this.facade.steps();
    const allScriptsSaved = steps.every(step => {
      const script = this.facade.getStepScript(step.id);
      if (!script || script.trim() === '') return true; // No script is fine
      return this.facade.isStepScriptSaved(step.id); // Script must be saved
    });

    return allScriptsSaved;
  }

  getRunButtonTitle(): string {
    if (this.facade.hasAnySyntaxErrors()) {
      return 'Fix syntax errors before running';
    }

    const steps = this.facade.steps();
    const unsavedSteps = steps.filter(step => {
      const script = this.facade.getStepScript(step.id);
      return script && script.trim() !== '' && !this.facade.isStepScriptSaved(step.id);
    });

    if (unsavedSteps.length > 0) {
      return `Save scripts for: ${unsavedSteps.map(s => s.name).join(', ')}`;
    }

    return 'Run the workflow';
  }
}
