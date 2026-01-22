// src/app/workflows/services/workflows.facade.ts

import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import type {
  Id,
  WorkflowDto,
  WorkflowListItemDto,
  StepDto,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  CreateStepRequest,
  UpdateStepRequest,
  RunWorkflowResponse,
  ExportTypeDto,
} from "../models/workflow-models";
import { WorkflowApi } from "./workflows.api";

import type { WorkflowVar } from "../components/monaco-step-editor/workflow-vars";
import { extractVarsFromCode } from "../components/monaco-step-editor/script-vars";
import { saveRun } from "./workflow-runs.store";

@Injectable({ providedIn: "root" })
export class WorkflowsFacade {
  private api = inject(WorkflowApi);

  // state
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly running = signal(false);
  readonly error = signal<string | null>(null);

  readonly workflow = signal<WorkflowDto | null>(null);
  readonly stepsState = signal<StepDto[]>([]);
  readonly selectedStepId = signal<Id | null>(null);

  // Script per step (client-side cache)
  readonly stepScriptByStepId = signal<Record<number, string>>({});

  // Vars extracted from each step script (LHS assignments)
  readonly stepVarsByStepId = signal<Record<number, Record<string, WorkflowVar>>>({});

  // Global input vars (merged from uploaded input files) — raw keys (Var1, Var2)
  readonly globalInputs = signal<Record<string, unknown>>({});

  // Syntax errors per step (Monaco -> facade)
  readonly stepSyntaxErrors = signal<Record<number, string[]>>({});

  // ✅ NEW: included outputs selection per step (for PUT /api/Step/script)
  readonly includedOutputsByStepId = signal<Record<number, string[]>>({});

  // ✅ NEW: export type list (GET /api/Workflow/export/types)
  readonly exportTypes = signal<ExportTypeDto[]>([]);

  // derived
  readonly steps = computed(() => this.stepsState());

  readonly selectedStep = computed(() => {
    const id = this.selectedStepId();
    return id == null ? null : this.stepsState().find(s => s.id === id) ?? null;
  });

  // Monaco completion variables (must be IDENTIFIER-compatible → no dots)
  // - include global input keys directly: Var1 (not input.Var1)
  // - include vars from previous steps AND current step (so step can reuse its own vars)
  readonly availableVariablesForSelectedStep = computed<WorkflowVar[]>(() => {
    const steps = this.stepsState();
    const selectedId = this.selectedStepId();
    if (selectedId == null) return [];

    const idx = steps.findIndex(s => s.id === selectedId);
    if (idx < 0) return [];

    const out: WorkflowVar[] = [];

    // global inputs: Var1, Var2, ...
    const inputs = this.globalInputs();
    for (const k of Object.keys(inputs ?? {})) {
      out.push({ name: k, kind: "unknown", source: "input" } as any);
    }

    // include vars from steps up to and including current step
    const varsByStep = this.stepVarsByStepId();
    for (let i = 0; i <= idx; i++) {
      const sid = steps[i].id;
      const m = varsByStep[sid];
      if (!m) continue;
      for (const v of Object.values(m)) out.push(v);
    }

    // unique by name
    const uniq = new Map<string, WorkflowVar>();
    for (const v of out) uniq.set(v.name, v);
    return [...uniq.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  // Run state
  readonly lastRun = signal<RunWorkflowResponse | null>(null);
  readonly lastRunExtension = signal<string>("");

  /* =======================
     Syntax errors
     ======================= */

  setStepSyntaxErrors(stepId: number, errors: string[]) {
    this.stepSyntaxErrors.update(m => ({ ...m, [stepId]: errors }));
  }

  hasAnySyntaxErrors(): boolean {
    const m = this.stepSyntaxErrors();
    return Object.values(m).some(list => (list?.length ?? 0) > 0);
  }

  getFirstSyntaxError(): string | null {
    const m = this.stepSyntaxErrors();
    for (const [sid, list] of Object.entries(m)) {
      if (list?.length) return `Step ${sid}: ${list[0]}`;
    }
    return null;
  }

  /* =======================
     Workflow loading / init
     ======================= */

  async loadWorkflow(workflowId: Id) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const listRes = await firstValueFrom(this.api.getWorkflows());
      const item = listRes.workflows.find(w => w.id === workflowId);

      if (!item) {
        this.workflow.set(null);
        this.stepsState.set([]);
        this.selectedStepId.set(null);
        this.error.set("Workflow not found");
        return;
      }

      this.workflow.set(this.mapListItemToWorkflowDto(item));
      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to load workflow");
    } finally {
      this.loading.set(false);
    }
  }

  initNewWorkflow() {
    const now = new Date().toISOString();
    this.workflow.set({
      id: 0,
      name: "New Workflow",
      description: "",
      version: 0,
      createdAt: now,
      updatedAt: now,
    });
    this.stepsState.set([]);
    this.selectedStepId.set(null);
    this.error.set(null);
  }

  private mapListItemToWorkflowDto(item: WorkflowListItemDto): WorkflowDto {
    return {
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      version: item.version,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  private async refreshSteps() {
    const wf = this.workflow();
    if (!wf?.id) {
      this.stepsState.set([]);
      this.selectedStepId.set(null);
      return;
    }

    const res = await firstValueFrom(this.api.getSteps(wf.id));
    const steps = res.steps ?? [];
    this.stepsState.set(steps);

    const currentSel = this.selectedStepId();
    const stillExists = currentSel != null && steps.some(s => s.id === currentSel);
    this.selectedStepId.set(stillExists ? currentSel : steps[0]?.id ?? null);
  }

  /* =======================
     Scripts / vars
     ======================= */

  getStepScript(stepId: number): string {
    return this.stepScriptByStepId()[stepId] ?? "";
  }

  onStepCodeChange(stepId: number, code: string) {
    // store script
    this.stepScriptByStepId.set({ ...this.stepScriptByStepId(), [stepId]: code });

    // extract vars from code (LHS assignments)
    const vars = extractVarsFromCode(code);
    const map: Record<string, WorkflowVar> = {};
    for (const v of vars) map[v.name] = { ...v, source: "step", stepId } as any;

    this.stepVarsByStepId.set({ ...this.stepVarsByStepId(), [stepId]: map });
  }

  /* =======================
     Workflow metadata
     ======================= */

  patchWorkflow(patch: Partial<WorkflowDto>) {
    const wf = this.workflow();
    if (!wf) return;

    this.workflow.set({
      ...wf,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }

  async saveWorkflow() {
    const wf = this.workflow();
    if (!wf) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      if (!wf.id || wf.id === 0) {
        const payload: CreateWorkflowRequest = {
          name: wf.name,
          description: wf.description,
        };
        const created = await firstValueFrom(this.api.createWorkflow(payload));
        this.workflow.set(created);
        this.stepsState.set([]);
        this.selectedStepId.set(null);
        return;
      }

      const payload: UpdateWorkflowRequest = {
        id: wf.id,
        name: wf.name,
        description: wf.description,
        version: wf.version,
      };

      const updated = await firstValueFrom(this.api.updateWorkflow(payload));
      this.workflow.set(updated);
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to save workflow");
    } finally {
      this.saving.set(false);
    }
  }

  /* =======================
     Steps
     ======================= */

  selectStep(stepId: Id) {
    this.selectedStepId.set(stepId);
  }

  async addStep(script: string = "") {
    let wf = this.workflow();
    if (!wf) return;

    // auto-create workflow if new
    if (!wf.id || wf.id === 0) {
      await this.saveWorkflow();
      wf = this.workflow();
      if (!wf?.id) return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const nextIndex = this.stepsState().length + 1;
      const payload: CreateStepRequest = {
        name: `Step ${nextIndex}`,
        description: "",
        cacheable: false,
        script,
        alias: `step${nextIndex}`, // ✅ default alias (UI can edit)
        workflowId: wf.id,
      };

      const created = await firstValueFrom(this.api.createStep(payload));
      this.stepsState.set([...this.stepsState(), created]);
      this.selectedStepId.set(created.id);

      // ensure local script cache is set too
      this.stepScriptByStepId.set({ ...this.stepScriptByStepId(), [created.id]: script });
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to add step");
    } finally {
      this.saving.set(false);
    }
  }

  async patchStep(stepId: Id, patch: Partial<StepDto>) {
    const current = this.stepsState().find(s => s.id === stepId);
    if (!current) return;

    const payload: UpdateStepRequest = {
      stepId,
      name: patch.name ?? current.name,
      description: patch.description ?? current.description,
      cacheable: patch.cacheable ?? current.cacheable,
      alias: patch.alias ?? current.alias, // ✅ NEW
    };

    this.saving.set(true);
    this.error.set(null);

    try {
      const updated = await firstValueFrom(this.api.updateStep(payload));
      this.stepsState.set(this.stepsState().map(s => (s.id === stepId ? updated : s)));
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to update step");
    } finally {
      this.saving.set(false);
    }
  }

  async deleteLastStep() {
    const wf = this.workflow();
    if (!wf?.id) return;
    if (this.stepsState().length === 0) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.deleteLastStep(wf.id));
      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to delete last step");
    } finally {
      this.saving.set(false);
    }
  }

  /* =======================
     Step script upload
     ======================= */

  /** ✅ selection state (checkboxes UI will call this later) */
  setIncludedOutputs(stepId: number, outputs: string[]) {
    this.includedOutputsByStepId.set({
      ...this.includedOutputsByStepId(),
      [stepId]: outputs,
    });
  }

  getIncludedOutputs(stepId: number): string[] {
    return this.includedOutputsByStepId()[stepId] ?? [];
  }

  async saveSelectedStepScript() {
    const step = this.selectedStep();
    if (!step) return;

    const script = this.getStepScript(step.id);
    const includedOutputs = this.getIncludedOutputs(step.id);

    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(
        this.api.uploadStepScript({ stepId: step.id, script, includedOutputs })
      );
      await this.refreshSteps(); // updates runnable flag
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to save script");
    } finally {
      this.saving.set(false);
    }
  }

  /* =======================
     Step input upload
     ======================= */

  async uploadSelectedStepInput(file: File) {
    const step = this.selectedStep();
    if (!step) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.api.uploadStepInput(step.id, file));

      // merge into global inputs (raw keys; usable in scripts)
      const merged = { ...this.globalInputs(), ...(res.inputs ?? {}) };
      this.globalInputs.set(merged);
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to upload input");
    } finally {
      this.saving.set(false);
    }
  }

  /* =======================
     Export types
     ======================= */

  async loadExportTypes() {
    try {
      const types = await firstValueFrom(this.api.getExportTypes());
      this.exportTypes.set(types ?? []);
    } catch {
      // non-blocking; UI can show fallback
      this.exportTypes.set([]);
    }
  }

  /* =======================
     Run
     ======================= */

  async runWorkflow(extension: string) {
    const wf = this.workflow();
    if (!wf?.id) return;

    // ✅ frontend gate
    if (this.hasAnySyntaxErrors()) {
      this.error.set("Fix syntax errors before running. " + (this.getFirstSyntaxError() ?? ""));
      return;
    }

    this.running.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.api.runWorkflow({ workflowId: wf.id, extension }));
      this.lastRun.set(res);
      this.lastRunExtension.set(extension);

      // Persist to local run history
      saveRun(wf.id, {
        runId: crypto.randomUUID(),
        workflowId: wf.id,
        createdAt: new Date().toISOString(),
        extension,
        result: res,
      });
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to run workflow");
    } finally {
      this.running.set(false);
    }
  }
}
