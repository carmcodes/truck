import {Component, computed, inject, signal, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import type {Id, RunStepRunDto} from '../../models/workflow-models';
import {clearRuns, loadRuns, type StoredRun} from '../../services/workflow-run.store';

@Component({
  standalone: true,
  selector: 'app-workflow-runs-page',
  imports: [CommonModule],
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

  // ✅ Updated to filter by included outputs
  getOutputVars(step: RunStepRunDto): Record<string, unknown> {
    const run = this.selectedRun();
    console.log('🔍 getOutputVars called for step:', step.stepId); // DEBUG
    console.log('🔍 Selected run:', run); // DEBUG

    if (!run) {
      console.log('❌ No run selected'); // DEBUG
      return {};
    }

    const allOutputs = step.outputs?.variables ?? {};
    console.log('🔍 All outputs from step:', allOutputs); // DEBUG

    const includedOutputs = run.includedOutputsSnapshot?.[step.stepId];
    console.log('🔍 Included outputs from snapshot for step', step.stepId, ':', includedOutputs); // DEBUG
    console.log('🔍 Full snapshot:', run.includedOutputsSnapshot); // DEBUG

    // If no included outputs snapshot exists, show all outputs (backward compatibility)
    if (!includedOutputs) {
      console.log('⚠️ No included outputs snapshot - showing all outputs'); // DEBUG
      return allOutputs;
    }

    // If included outputs array is empty, show nothing
    if (includedOutputs.length === 0) {
      console.log('ℹ️ Included outputs is empty array - showing nothing'); // DEBUG
      return {};
    }

    // Filter to only show included outputs
    const filtered: Record<string, unknown> = {};
    for (const key of includedOutputs) {
      if (key in allOutputs) {
        filtered[key] = allOutputs[key];
        console.log(`✅ Including output: ${key} = ${allOutputs[key]}`); // DEBUG
      } else {
        console.log(`⚠️ Included output "${key}" not found in actual outputs`); // DEBUG
      }
    }

    console.log('🔍 Filtered outputs:', filtered); // DEBUG
    return filtered;
  }

  getInputVarsForStep(runSteps: RunStepRunDto[], index: number): Record<string, unknown> {
    const vars: Record<string, unknown> = {};
    for (let i = 0; i < index; i++) {
      const out = runSteps[i]?.outputs?.variables ?? {};
      Object.assign(vars, out);
    }
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

  getAvailableInputsForStep(run: StoredRun, index: number, stepId: number): Record<string, unknown> {
    const vars: Record<string, unknown> = {};
    Object.assign(vars, run.globalInputsSnapshot ?? {});

    const steps = run.result.stepRuns ?? [];
    for (let i = 0; i < index; i++) {
      const out = steps[i]?.outputs?.variables ?? {};
      Object.assign(vars, out);
    }
    const declared = run.declaredVarsByStepIdSnapshot?.[stepId] ?? [];
    for (const k of declared) {
      if (!(k in vars)) {
        vars[k] = undefined;
      }
    }
    return vars;
  }

  protected readonly navigator = navigator;
}
