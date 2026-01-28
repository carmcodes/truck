import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import type { Id, RunStepRunDto } from "../../models/workflow-models";
import { clearRuns, loadRuns, type StoredRun } from "../../services/workflow-run.store";
import { DsButtonModule } from "@bmw-ds/components";

@Component({
  standalone: true,
  selector: "app-workflow-runs-page",
  imports: [CommonModule, RouterLink, DsButtonModule],
  templateUrl: "./workflow-runs-page.html",
})
export class WorkflowRunsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly workflowId = computed(() => Number(this.route.snapshot.paramMap.get("id")) as Id);

  readonly runs = signal<StoredRun[]>([]);
  readonly selectedRunId = signal<string | null>(null);
  readonly expandedStepIndex = signal<number | null>(null); // UI index, not DB id

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
    this.expandedStepIndex.set(null);
  }

  selectRun(runId: string) {
    this.selectedRunId.set(runId);
    this.expandedStepIndex.set(null);
  }

  toggleStepByIndex(i: number) {
    this.expandedStepIndex.set(this.expandedStepIndex() === i ? null : i);
  }

  backToDesigner() {
    this.router.navigate(["/workflows", this.workflowId(), "designer"]);
  }

  clearHistory() {
    clearRuns(this.workflowId());
    this.refresh();
  }

  // ---------- Display helpers ----------

  stepTitle(step: RunStepRunDto, index: number): string {
    // no ids, keep friendly label
    return step.stepName?.trim() ? step.stepName : `Step ${index + 1}`;
  }

  statusText(step: RunStepRunDto): string {
    return step.status ? "Succeeded" : "Failed";
  }

  /** Returns ONLY the checked variables for this step (from Variables panel snapshot). */
  /** Normalize keys so input vars match even if alias differs */
  private normalizeVarName(name: string): string {
    // Inputs.anyAlias.Var1  -> Var1
    // step1.Var1            -> Var1 (if you ever use this form)
    const parts = name.split(".");
    return parts[parts.length - 1] ?? name;
  }

  private baseName(name: string): string {
    // inputs.step4.var1 -> var1
    // Inputs.step4.var1 -> var1
    const parts = (name ?? "").split(".");
    return parts[parts.length - 1] ?? name;
  }

  private buildInputsVisibleForStep(run: StoredRun, stepIndex: number): Record<string, unknown> {
    const merged: Record<string, unknown> = {};
    const steps = run.result.stepRuns ?? [];

    // inputs are visible from step 0..current step (inclusive)
    for (let i = 0; i <= stepIndex; i++) {
      const sid = steps[i]?.stepId;
      if (!sid) continue;
      Object.assign(merged, run.inputsSnapshotByStepId?.[sid] ?? {});
    }
    return merged;
  }

  private tryPickValue(
    selectedKey: string,
    outVars: Record<string, unknown>,
    inputsVisible: Record<string, unknown>
  ): unknown | undefined {
    const sel = selectedKey;
    const base = this.baseName(sel);

    // 1) exact in outputs
    if (sel in outVars) return (outVars as any)[sel];

    // 2) base-name match in outputs (handles i vs inputs.step4.i)
    for (const k of Object.keys(outVars)) {
      if (this.baseName(k) === base) return (outVars as any)[k];
    }

    // 3) exact in inputs snapshot
    if (sel in inputsVisible) return (inputsVisible as any)[sel];

    // 4) base-name in inputs snapshot (handles inputs.step4.var1 vs var1)
    if (base in inputsVisible) return (inputsVisible as any)[base];

    // 5) base-name match in inputs snapshot (in case snapshot itself is namespaced)
    for (const k of Object.keys(inputsVisible)) {
      if (this.baseName(k) === base) return (inputsVisible as any)[k];
    }

    return undefined;
  }

  getSelectedVarsForDisplay(run: StoredRun, step: RunStepRunDto, stepIndex: number) {
    const selected = run.includedOutputsSnapshot?.[step.stepId] ?? [];
    const outVars = step.outputs?.variables ?? {};
    const inputsVisible = this.buildInputsVisibleForStep(run, stepIndex);

    return selected.map(sel => {
      const value = this.tryPickValue(sel, outVars, inputsVisible);
      return {
        key: sel,                 // ✅ show exactly what was selected
        value: value,             // resolved value
        found: value !== undefined
      };
    });
  }

  /** Convert vars object into display rows */
  toVarRows(vars: Record<string, unknown>): { key: string; value: string; type: string }[] {
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

  copyLogs(logs: string | null | undefined) {
    navigator.clipboard.writeText(logs ?? "");
  }
}
