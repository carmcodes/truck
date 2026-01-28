import {Component, computed, inject, signal, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

  /**
   * Get input variables for a step
   * Inputs include:
   * 1. File inputs uploaded to current step and all previous steps
   * 2. Selected output variables from all previous steps (not current step)
   */
  getInputVarsForStep(run: StoredRun, stepIndex: number, stepId: number): Record<string, unknown> {
    const allInputs: Record<string, unknown> = {};

    // 1. Add file inputs from step 0 to current step (inclusive)
    if (run.inputsByStepId) {
      const stepRuns = run.result.stepRuns ?? [];
      for (let i = 0; i <= stepIndex; i++) {
        const prevStepId = stepRuns[i]?.stepId;
        if (prevStepId && run.inputsByStepId[prevStepId]) {
          Object.assign(allInputs, run.inputsByStepId[prevStepId]);
        }
      }
    }

    // 2. Add selected output variables from previous steps (step 0 to stepIndex-1)
    const stepRuns = run.result.stepRuns ?? [];
    for (let i = 0; i < stepIndex; i++) {
      const prevStep = stepRuns[i];
      if (!prevStep) continue;

      const prevStepOutputs = prevStep.outputs?.variables ?? {};
      const prevStepIncludedOutputs = run.includedOutputsSnapshot?.[prevStep.stepId] ?? [];

      // If no included outputs specified, include all (backward compatibility)
      if (prevStepIncludedOutputs.length === 0 && Object.keys(prevStepOutputs).length > 0) {
        Object.assign(allInputs, prevStepOutputs);
      } else {
        // Include only selected outputs
        for (const varName of prevStepIncludedOutputs) {
          if (varName in prevStepOutputs) {
            allInputs[varName] = prevStepOutputs[varName];
          }
        }
      }
    }

    return allInputs;
  }

  /**
   * Get output variables for a step
   * Returns only the variables that were selected to be included in outputs
   */
  getOutputVarsForStep(step: RunStepRunDto): Record<string, unknown> {
    const run = this.selectedRun();
    if (!run) return {};

    const allOutputs = step.outputs?.variables ?? {};
    const includedOutputs = run.includedOutputsSnapshot?.[step.stepId] ?? [];

    // If no included outputs specified, show all (backward compatibility)
    if (includedOutputs.length === 0) {
      return allOutputs;
    }

    // Filter to only show included outputs
    const filtered: Record<string, unknown> = {};
    for (const varName of includedOutputs) {
      if (varName in allOutputs) {
        filtered[varName] = allOutputs[varName];
      }
    }

    return filtered;
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
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v;
  }

  formatValue(v: unknown): string {
    if (v === null) return 'null';
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);

    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }

  logLines(logs: string | null | undefined): string[] {
    if (!logs) return [];
    return logs.split(/\r?\n/);
  }

  protected readonly navigator = navigator;
}
