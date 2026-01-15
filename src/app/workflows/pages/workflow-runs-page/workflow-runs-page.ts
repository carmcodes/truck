import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import type { Id, RunStepRunDto } from "../../models/workflow-models";
import { clearRuns, loadRuns, type StoredRun } from "../../services/workflow-runs.store";

@Component({
  standalone: true,
  selector: "app-workflow-runs-page",
  imports: [CommonModule],
  templateUrl: "./workflow-runs-page.html",
})
export class WorkflowRunsPage {
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

  // used in template (no arrow functions in HTML!)
  stepStatusLabel(s: RunStepRunDto) {
    return s.status ? "Succeeded" : "Failed";
  }

  getOutputVars(step: RunStepRunDto): Record<string, unknown> {
    return step.outputs?.variables ?? {};
  }

  /** Input vars for the step = previous step outputs (or empty for first step) */
  getInputVarsForStep(runSteps: RunStepRunDto[], index: number): Record<string, unknown> {
    if (index <= 0) return {};
    const prev = runSteps[index - 1];
    return prev?.outputs?.variables ?? {};
  }

  /** Convert a vars object into display rows */
  toVarRows(vars: Record<string, unknown>): { key: string; value: string; type: string }[] {
    const rows: { key: string; value: string; type: string }[] = [];

    const keys = Object.keys(vars ?? {}).sort((a, b) => a.localeCompare(b));
    for (const k of keys) {
      const v = (vars as any)[k];
      rows.push({
        key: k,
        value: this.formatValue(v),
        type: this.valueType(v),
      });
    }
    return rows;
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

    // objects/arrays -> short JSON (single-line)
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }

  /** Split logs into lines for nicer rendering */
  logLines(logs: string | null | undefined): string[] {
    if (!logs) return [];
    return logs.split(/\r?\n/);
  }

  /** convenience badge text */
  statusText(step: RunStepRunDto): string {
    return step.status ? "Succeeded" : "Failed";
  }

  protected readonly navigator = navigator;
}
