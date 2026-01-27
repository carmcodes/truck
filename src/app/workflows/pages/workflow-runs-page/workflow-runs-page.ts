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
    console.log('📊 All runs loaded:', list);
    this.runs.set(list);
    this.selectedRunId.set(list[0]?.runId ?? null);
    this.expandedStepId.set(null);

    if (list[0]) {
      console.log('🔍 First run details:', {
        runId: list[0].runId,
        stepRuns: list[0].result.stepRuns,
        includedOutputsSnapshot: list[0].includedOutputsSnapshot,
        inputsByStepId: list[0].inputsByStepId
      });

      // Log each step's outputs
      list[0].result.stepRuns?.forEach((step, idx) => {
        console.log(`📦 Step ${idx} (ID: ${step.stepId}, Name: ${step.stepName}):`, {
          outputs: step.outputs,
          variables: step.outputs?.variables,
          status: step.status,
          cached: step.cached
        });
      });
    }
  }

  selectRun(runId: string) {
    this.selectedRunId.set(runId);
    this.expandedStepId.set(null);
  }

  toggleStep(stepId: number) {
    const newExpandedId = this.expandedStepId() === stepId ? null : stepId;
    this.expandedStepId.set(newExpandedId);

    if (newExpandedId) {
      const run = this.selectedRun();
      const step = run?.result.stepRuns?.find(s => s.stepId === stepId);
      console.log('🔍 Expanded step details:', {
        stepId,
        step,
        outputs: step?.outputs,
        variables: step?.outputs?.variables
      });
    }
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

  getOutputVars(step: RunStepRunDto): Record<string, unknown> {
    const run = this.selectedRun();
    if (!run) {
      console.log('❌ No run selected');
      return {};
    }

    console.log('🔍 getOutputVars for step:', step.stepId);
    console.log('  Raw step object:', step);
    console.log('  step.outputs:', step.outputs);
    console.log('  step.outputs?.variables:', step.outputs?.variables);

    const allOutputs = step.outputs?.variables ?? {};
    const outputKeys = Object.keys(allOutputs);
    console.log('  All output keys:', outputKeys);
    console.log('  All outputs:', allOutputs);

    const includedOutputs = run.includedOutputsSnapshot?.[step.stepId];
    console.log('  Included outputs from snapshot:', includedOutputs);

    // If no snapshot exists, show all outputs
    if (!includedOutputs) {
      console.log('  ⚠️ No snapshot - returning all outputs:', allOutputs);
      return allOutputs;
    }

    // If snapshot exists but is empty, show nothing
    if (includedOutputs.length === 0) {
      console.log('  ℹ️ Empty snapshot - returning empty object');
      return {};
    }

    // Filter to only show included outputs
    const filtered: Record<string, unknown> = {};
    for (const key of includedOutputs) {
      if (key in allOutputs) {
        filtered[key] = allOutputs[key];
        console.log(`  ✅ Including: ${key} = ${allOutputs[key]}`);
      } else {
        console.log(`  ⚠️ Key "${key}" not found in actual outputs`);
      }
    }

    console.log('  Final filtered outputs:', filtered);
    return filtered;
  }

  getInputVarsForStep(run: StoredRun, stepIndex: number, stepId: number): Record<string, unknown> {
    const vars: Record<string, unknown> = {};

    console.log(`🔍 Getting inputs for step ${stepId} (index ${stepIndex})`);
    console.log('  Run object:', run);
    console.log('  inputsByStepId:', run.inputsByStepId);

    // 1. Add file inputs from inputsByStepId
    if (run.inputsByStepId) {
      const steps = run.result.stepRuns ?? [];
      for (let i = 0; i <= stepIndex; i++) {
        const prevStepId = steps[i]?.stepId;
        if (prevStepId && run.inputsByStepId[prevStepId]) {
          const stepInputs = run.inputsByStepId[prevStepId];
          console.log(`  📥 File inputs from step ${prevStepId}:`, stepInputs);
          Object.assign(vars, stepInputs);
        }
      }
    }

    // 2. Add outputs from previous steps
    const stepRuns = run.result.stepRuns ?? [];
    console.log('  Total step runs:', stepRuns.length);

    for (let i = 0; i < stepIndex; i++) {
      const prevStep = stepRuns[i];
      console.log(`  Checking previous step ${i} (ID: ${prevStep?.stepId}):`, prevStep);

      if (prevStep?.outputs?.variables) {
        console.log(`    Previous step ${prevStep.stepId} has variables:`, prevStep.outputs.variables);

        const prevStepIncludedOutputs = run.includedOutputsSnapshot?.[prevStep.stepId];
        console.log(`    Included outputs for step ${prevStep.stepId}:`, prevStepIncludedOutputs);

        if (prevStepIncludedOutputs && prevStepIncludedOutputs.length > 0) {
          // Only include selected outputs
          for (const key of prevStepIncludedOutputs) {
            if (key in prevStep.outputs.variables) {
              vars[key] = prevStep.outputs.variables[key];
              console.log(`    ✅ Adding: ${key} = ${prevStep.outputs.variables[key]}`);
            }
          }
        } else if (!prevStepIncludedOutputs) {
          // No snapshot - include all
          console.log(`    📤 No snapshot - adding all outputs`);
          Object.assign(vars, prevStep.outputs.variables);
        }
      } else {
        console.log(`    ⚠️ Previous step has no variables`);
      }
    }

    console.log(`  ✅ Final input vars:`, vars);
    return vars;
  }

  toVarRows(vars: Record<string, unknown>): { key: string; value: string; type: string }[] {
    console.log('🔄 Converting vars to rows:', vars);
    const rows: { key: string; value: string; type: string }[] = [];

    const keys = Object.keys(vars ?? {}).sort((a, b) => a.localeCompare(b));
    console.log('  Keys:', keys);

    for (const k of keys) {
      const v = (vars as any)[k];
      rows.push({
        key: k,
        value: this.formatValue(v),
        type: this.valueType(v)
      });
    }

    console.log('  Resulting rows:', rows);
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
