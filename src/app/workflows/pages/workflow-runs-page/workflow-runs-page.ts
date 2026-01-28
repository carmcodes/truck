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
  getCheckedVarsForStep(run: StoredRun, step: RunStepRunDto): Record<string, unknown> {
    const allOutputs = step.outputs?.variables ?? {};

    const selected = run.includedOutputsSnapshot?.[step.stepId] ?? null;

    // If snapshot missing (older runs), fall back to showing all outputs
    if (!selected) return allOutputs;

    // If snapshot exists but user selected none -> show none (intentional)
    if (selected.length === 0) return {};

    const filtered: Record<string, unknown> = {};
    for (const key of selected) {
      if (key in allOutputs) filtered[key] = (allOutputs as any)[key];
    }
    return filtered;
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
