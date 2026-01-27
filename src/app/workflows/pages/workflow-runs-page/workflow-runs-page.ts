import {Component, computed, inject, signal, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import type {Id, RunStepRunDto} from '../../models/workflow-models';
import {clearRuns, loadRuns, type StoredRun} from '../../services/workflow-run.store';
import {DsButtonModule} from "@bmw-ds/components";

@Component({
  standalone: true,
  selector: 'app-workflow-runs-page',
  imports: [CommonModule, DsButtonModule],
  templateUrl: './workflow-runs-page.html'
})
export class WorkflowRunsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly workflowId = computed(() => Number(this.route.snapshot.paramMap.get('id')) as Id);

  readonly runs = signal<StoredRun[]>([]);
  readonly selectedRunId = signal<string | null>(null);
  readonly expandedStepId = signal<number | null>(null);

  readonly selectedRun = computed(() => {
    const id = this.selectedRunId();
    return this.runs().find(r => r.runId === id) ?? null;
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    const list = loadRuns(this.workflowId());
    this.runs.set(list);
    this.selectedRunId.set(list[0]?.runId ?? null);
    this.expandedStepId.set(null);
  }

  selectRun(runId: string) {
    this.selectedRunId.set(runId);
    this.expandedStepId.set(null);
  }

  toggleStep(stepId: number) {
    this.expandedStepId.set(this.expandedStepId() === stepId ? null : stepId);
  }

  backToDesigner() {
    this.router.navigate(['/workflows', this.workflowId(), 'designer']);
  }

  clearHistory() {
    clearRuns(this.workflowId());
    this.refresh();
  }

  stepStatusLabel(s: RunStepRunDto) {
    return s.status ? 'Succeeded' : 'Failed';
  }

  // ✅ Get outputs for a step - filtered by included outputs
  getOutputVars(step: RunStepRunDto): Record<string, unknown> {
    const run = this.selectedRun();
    if (!run) {
      console.log('❌ No run selected');
      return {};
    }

    const allOutputs = step.outputs?.variables ?? {};
    console.log('📊 All outputs from step', step.stepId, ':', allOutputs);

    const includedOutputs = run.includedOutputsSnapshot?.[step.stepId];
    console.log('📸 Included outputs for step', step.stepId, ':', includedOutputs);

    // If no snapshot exists, show all outputs (backward compatibility)
    if (!includedOutputs) {
      console.log('⚠️ No included outputs snapshot - showing all outputs');
      return allOutputs;
    }

    // If snapshot exists but is empty array, show nothing
    if (includedOutputs.length === 0) {
      console.log('ℹ️ Included outputs is empty - showing nothing');
      return {};
    }

    // Filter to only show included outputs
    const filtered: Record<string, unknown> = {};
    for (const key of includedOutputs) {
      if (key in allOutputs) {
        filtered[key] = allOutputs[key];
        console.log(`✅ Including output: ${key}`);
      } else {
        console.log(`⚠️ Included output "${key}" not found in actual outputs`);
      }
    }

    console.log('✅ Filtered outputs:', filtered);
    return filtered;
  }

  // ✅ Get input variables for a step - includes file inputs + previous step outputs
  getInputVarsForStep(run: StoredRun, stepIndex: number, stepId: number): Record<string, unknown> {
    const vars: Record<string, unknown> = {};

    console.log(`🔍 Getting inputs for step ${stepId} (index ${stepIndex})`);

    // 1. Add file inputs from inputsByStepId for all steps up to current step
    // These are the JSON files uploaded via the Inputs panel
    if (run.inputsByStepId) {
      const steps = run.result.stepRuns ?? [];
      for (let i = 0; i <= stepIndex; i++) {
        const prevStepId = steps[i]?.stepId;
        if (prevStepId && run.inputsByStepId[prevStepId]) {
          const stepInputs = run.inputsByStepId[prevStepId];
          console.log(`📥 Adding file inputs from step ${prevStepId}:`, stepInputs);
          Object.assign(vars, stepInputs);
        }
      }
    }

    // 2. Add outputs from previous steps (not current step)
    const stepRuns = run.result.stepRuns ?? [];
    for (let i = 0; i < stepIndex; i++) {
      const prevStep = stepRuns[i];
      if (prevStep?.outputs?.variables) {
        // Get the included outputs for this previous step
        const prevStepIncludedOutputs = run.includedOutputsSnapshot?.[prevStep.stepId];

        if (prevStepIncludedOutputs && prevStepIncludedOutputs.length > 0) {
          // Only include the selected outputs from previous steps
          for (const key of prevStepIncludedOutputs) {
            if (key in prevStep.outputs.variables) {
              vars[key] = prevStep.outputs.variables[key];
              console.log(`✅ Adding output from step ${prevStep.stepId}: ${key}`);
            }
          }
        } else if (!prevStepIncludedOutputs) {
          // No snapshot - include all outputs (backward compatibility)
          console.log(`📤 Adding all outputs from step ${prevStep.stepId}`);
          Object.assign(vars, prevStep.outputs.variables);
        }
        // If prevStepIncludedOutputs exists but is empty, don't add anything
      }
    }

    console.log(`✅ Total input variables for step ${stepId}:`, vars);
    return vars;
  }

  toVarRows(vars: Record<string, unknown>): { key: string; value: string; type: string }[] {
    const rows: { key: string; value: string; type: string }[] = [];

    const keys = Object.keys(vars ?? {}).sort((a, b) => a.localeCompare(b));
    for (const k of keys) {
      const v = (vars as any)[k];
      rows.push({
        key: k,
        value: this.formatValue(v),
        type: this.valueType(v)
      });
    }
    return rows;
  }

  valueType(v: unknown): string {
    if (v === null) {
      return 'null';
    }
    if (Array.isArray(v)) {
      return 'array';
    }
    return typeof v;
  }

  formatValue(v: unknown): string {
    if (v === null) {
      return 'null';
    }
    if (typeof v === 'string') {
      return v;
    }
    if (typeof v === 'number' || typeof v === 'boolean') {
      return String(v);
    }

    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }

  logLines(logs: string | null | undefined): string[] {
    if (!logs) {
      return [];
    }
    return logs.split(/\r?\n/);
  }

  statusText(step: RunStepRunDto): string {
    return step.status ? 'Succeeded' : 'Failed';
  }

  protected readonly navigator = navigator;
}
