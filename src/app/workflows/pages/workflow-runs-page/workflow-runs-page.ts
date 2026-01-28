import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import type { Id, RunStepRunDto } from "../../models/workflow-models";
import { clearRuns, loadRuns, type StoredRun } from "../../services/workflow-run.store";
import { DsButtonModule } from "@bmw-ds/components";

type VarRow = { key: string; value: string; type: string };

@Component({
  standalone: true,
  selector: "app-workflow-runs-page",
  imports: [CommonModule, DsButtonModule],
  templateUrl: "./workflow-runs-page.html",
})
export class WorkflowRunsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly workflowId = computed(() => Number(this.route.snapshot.paramMap.get("id")) as Id);

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
    this.router.navigate(["/workflows", this.workflowId(), "designer"]);
  }

  clearHistory() {
    clearRuns(this.workflowId());
    this.refresh();
  }

  statusText(s: RunStepRunDto) {
    return s.status ? "Succeeded" : "Failed";
  }

  /** ---------- KEY PART: AVAILABLE INPUTS FOR A STEP ---------- */

  /**
   * Inputs shown in runs page for a step = ALL variables available to that step:
   * - uploaded file vars from steps <= current step (namespaced Inputs.<alias>.<var>)
   * - script-declared vars from steps <= current step (raw var names)
   *
   * Values:
   * - file vars: from run.inputsByStepId (if stored)
   * - script vars: try to resolve from run.result.stepRuns outputs (latest value up to current step)
   */
  getAvailableInputsForStep(run: StoredRun, stepIndex: number): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    const stepRuns = run.result?.stepRuns ?? [];
    const inputsByStepId = run.inputsByStepId ?? {};
    const scriptVarsByStepId = run.scriptVarsByStepId ?? {};

    // helper: resolve value of a script var from outputs up to current step
    const resolveScriptVarValue = (varName: string): unknown => {
      // look backwards from current step to find latest output value
      for (let i = stepIndex; i >= 0; i--) {
        const sr = stepRuns[i];
        const out = sr?.outputs?.variables ?? {};
        if (varName in out) return (out as any)[varName];
      }
      return undefined;
    };

    // 1) uploaded file vars up to current step (inclusive), namespaced
    for (let i = 0; i <= stepIndex; i++) {
      const sr = stepRuns[i];
      if (!sr) continue;

      const sid = sr.stepId;
      const alias = this.safeAlias(sr.stepName, i); // fallback if alias not available
      const fileVars = inputsByStepId[sid] ?? {};

      for (const k of Object.keys(fileVars)) {
        const namespaced = `Inputs.${alias}.${k}`;
        result[namespaced] = (fileVars as any)[k];
      }
    }

    // 2) script-declared vars up to current step (inclusive), raw names
    for (let i = 0; i <= stepIndex; i++) {
      const sr = stepRuns[i];
      if (!sr) continue;

      const sid = sr.stepId;
      const declared = scriptVarsByStepId[sid] ?? [];

      for (const varName of declared) {
        // if also exists as a file var key, keep both (namespaced file var + raw script var)
        result[varName] = resolveScriptVarValue(varName);
      }
    }

    return result;
  }

  /** ---------- OUTPUTS: ONLY INCLUDED OUTPUT VARIABLES ---------- */

  /**
   * Output variables shown for a step = INCLUDED outputs only (checkbox selection)
   * Values always come from step.outputs.variables
   */
  getIncludedOutputsForStep(run: StoredRun, step: RunStepRunDto): Record<string, unknown> {
    const allOutputs = step.outputs?.variables ?? {};
    const included = run.includedOutputsSnapshot?.[step.stepId] ?? [];

    // if user selected none, show none (your new UX requirement)
    if (!included.length) return {};

    const filtered: Record<string, unknown> = {};
    for (const k of included) {
      if (k in allOutputs) filtered[k] = (allOutputs as any)[k];
    }
    return filtered;
  }

  /** ---------- UI helpers ---------- */

  toVarRows(vars: Record<string, unknown>): VarRow[] {
    const keys = Object.keys(vars ?? {}).sort((a, b) => a.localeCompare(b));
    return keys.map(k => {
      const v = (vars as any)[k];
      return { key: k, value: this.formatValue(v), type: this.valueType(v) };
    });
  }

  valueType(v: unknown): string {
    if (v === null) return "null";
    if (Array.isArray(v)) return "array";
    return typeof v; // string/number/boolean/object/undefined
  }

  formatValue(v: unknown): string {
    if (v === null) return "null";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);

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

  /** We don't have alias in run response, so use a safe fallback.
   * If you DO have step alias anywhere, replace this to use it.
   */
  private safeAlias(stepName: string | undefined, index: number): string {
    // prefer something stable-ish for display
    const n = stepName?.trim();
    if (n) return n.replace(/\s+/g, "_");
    return `step${index + 1}`;
  }

  protected readonly navigator = navigator;
}
