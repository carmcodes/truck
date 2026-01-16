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
  StepInputs, UpdateStepRequest,
} from "../models/workflow-models";
import {WorkflowApi} from './workflows.api';
import {WorkflowVar} from '../components/monaco-step-editor/workflow-vars';
import {extractVarsFromCode} from '../components/monaco-step-editor/script-vars';
import type { RunWorkflowResponse } from "../models/workflow-models";
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

  // NEW: inputs stored per step
  readonly stepInputsByStepId = signal<Record<Id, StepInputs>>({});
  // Script per step (client-side cache)
  readonly stepScriptByStepId = signal<Record<number, string>>({});

// Vars extracted from each step script
  readonly stepVarsByStepId = signal<Record<number, Record<string, WorkflowVar>>>({});

// Global input vars (merged from uploaded input files)
  readonly globalInputs = signal<Record<string, unknown>>({});
  readonly stepSyntaxErrors = signal<Record<number, string[]>>({});

  // derived
  readonly steps = computed(() => this.stepsState());
  readonly selectedStep = computed(() => {
    const id = this.selectedStepId();
    return id == null ? null : this.stepsState().find((s) => s.id === id) ?? null;
  });

  readonly selectedStepInputs = computed<StepInputs>(() => {
    const id = this.selectedStepId();
    if (id == null) return {};
    return this.stepInputsByStepId()[id] ?? {};
  });

  readonly availableVariablesForSelectedStep = computed<WorkflowVar[]>(() => {
    const steps = this.stepsState();
    const selectedId = this.selectedStepId();
    if (selectedId == null) return [];

    const idx = steps.findIndex(s => s.id === selectedId);
    if (idx < 0) return [];

    const out: WorkflowVar[] = [];

    // 1) global inputs => expose as input.VarName
    const inputs = this.globalInputs();
    for (const k of Object.keys(inputs ?? {})) {
      out.push({ name: `input.${k}`, kind: "unknown", source: "input" });
    }

    // 2) vars from steps before current step
    const varsByStep = this.stepVarsByStepId();
    for (let i = 0; i < idx; i++) {
      const sid = steps[i].id;
      const m = varsByStep[sid];
      if (!m) continue;

      for (const v of Object.values(m)) {
        // available by raw name (IDENTIFIER)
        out.push(v);
      }
    }

    // Unique by name (later wins)
    const uniq = new Map<string, WorkflowVar>();
    for (const v of out) uniq.set(v.name, v);

    return [...uniq.values()].sort((a, b) => a.name.localeCompare(b.name));
  });
  readonly lastRun = signal<RunWorkflowResponse | null>(null);
  readonly lastRunExtension = signal<string>(""); // optional


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


  // ------------ loading / init ------------
  async loadWorkflow(workflowId: Id) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const listRes = await firstValueFrom(this.api.getWorkflows());
      const item = listRes.workflows.find((w) => w.id === workflowId);

      if (!item) {
        this.workflow.set(null);
        this.stepsState.set([]);
        this.selectedStepId.set(null);
        this.stepInputsByStepId.set({});
        this.error.set("Workflow not found");
        return;
      }

      const wf: WorkflowDto = this.mapListItemToWorkflowDto(item);
      this.workflow.set(wf);

      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to load workflow");
    } finally {
      this.loading.set(false);
    }
  }

  getStepScript(stepId: number): string {
    return this.stepScriptByStepId()[stepId] ?? "";
  }

  onStepCodeChange(stepId: number, code: string) {
    // store script
    const scripts = { ...this.stepScriptByStepId() };
    scripts[stepId] = code;
    this.stepScriptByStepId.set(scripts);

    // extract vars from code (LHS assignments)
    const vars = extractVarsFromCode(code);
    const map: Record<string, WorkflowVar> = {};
    for (const v of vars) map[v.name] = { ...v, source: "step", stepId };

    const all = { ...this.stepVarsByStepId() };
    all[stepId] = map;
    this.stepVarsByStepId.set(all);
  }


  initNewWorkflow() {
    const now = new Date().toISOString();
    const wf: WorkflowDto = {
      id: 0,
      name: "New Workflow",
      description: "",
      version: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.workflow.set(wf);
    this.stepsState.set([]);
    this.selectedStepId.set(null);
    this.stepInputsByStepId.set({});
    this.error.set(null);
  }

  private async refreshSteps() {
    const wf = this.workflow();
    if (!wf || !wf.id) {
      this.stepsState.set([]);
      this.selectedStepId.set(null);
      return;
    }

    const res = await firstValueFrom(this.api.getSteps(wf.id));
    const steps = res.steps ?? [];
    this.stepsState.set(steps);

    // keep selection stable if possible
    const currentSel = this.selectedStepId();
    const stillExists = currentSel != null && steps.some((s) => s.id === currentSel);
    this.selectedStepId.set(stillExists ? currentSel : steps[0]?.id ?? null);
  }

  private mapListItemToWorkflowDto(item: WorkflowListItemDto): WorkflowDto {
    return {
      id: item.id,
      name: item.name,
      description: "",
      version: item.version,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  private setStepScript(stepId: number, code: string) {
    // store script
    const scripts = { ...this.stepScriptByStepId() };
    scripts[stepId] = code;
    this.stepScriptByStepId.set(scripts);

    // extract vars from script
    const vars = extractVarsFromCode(code);
    const map: Record<string, WorkflowVar> = {};
    for (const v of vars) map[v.name] = { ...v, source: "step", stepId };

    const all = { ...this.stepVarsByStepId() };
    all[stepId] = map;
    this.stepVarsByStepId.set(all);
  }

  async saveSelectedStepScript() {
    const step = this.selectedStep();
    if (!step) return;

    const script = this.getStepScript(step.id);

    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.uploadStepScript({ stepId: step.id, script }));
      await this.refreshSteps(); // update runnable
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to save script");
    } finally {
      this.saving.set(false);
    }
  }

  async uploadSelectedStepInput(file: File) {
    const step = this.selectedStep();
    if (!step) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.api.uploadStepInput(step.id, file));

      // Merge into global inputs (inputs usable in future steps)
      const merged = { ...this.globalInputs(), ...(res.inputs ?? {}) };
      this.globalInputs.set(merged);

    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to upload input");
    } finally {
      this.saving.set(false);
    }
  }




  // ------------ editing workflow metadata ------------
  patchWorkflow(patch: Partial<WorkflowDto>) {
    const wf = this.workflow();
    if (!wf) return;

    this.workflow.set({
      ...wf,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }

  // ------------ steps ------------
  async addStep(script: string = "") {
    let wf = this.workflow();
    if (!wf) return;

    // ✅ Auto-create the workflow if it's not saved yet
    if (!wf.id || wf.id === 0) {
      await this.saveWorkflow();
      wf = this.workflow();

      // If still no id, something failed in create
      if (!wf?.id) return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const payload = {
        name: `Step ${this.stepsState().length + 1}`,
        description: "",
        cacheable: false,
        workflowId: wf.id,
        script,
      };

      const created = await firstValueFrom(this.api.createStep(payload));
      this.stepsState.set([...this.stepsState(), created]);
      this.selectedStepId.set(created.id);
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to add step");
    } finally {
      this.saving.set(false);
    }
  }


  async deleteLastStep() {
    const wf = this.workflow();
    if (!wf || !wf.id) return;
    if (this.stepsState().length === 0) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.deleteLastStep(wf.id));
      await this.refreshSteps();
      // NOTE: keep inputs map; backend deleted last step, but we don't know which id it was.
      // optional cleanup: if you want, you can clear everything for safety:
      // this.stepInputsByStepId.set({});
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to delete last step");
    } finally {
      this.saving.set(false);
    }
  }

  selectStep(stepId: Id) {
    this.selectedStepId.set(stepId);
  }

  // ------------ persistence (workflow only) ------------
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
  /**
   * PATCH-like convenience for step update.
   * Backend supports PUT /api/Step with: name, description, cacheable, stepId
   */
  async patchStep(stepId: Id, patch: Partial<StepDto>) {
    const current = this.stepsState().find((s) => s.id === stepId);
    if (!current) return;

    const payload: UpdateStepRequest = {
      stepId,
      name: patch.name ?? current.name,
      description: patch.description ?? current.description,
      cacheable: patch.cacheable ?? current.cacheable,
    };

    this.saving.set(true);
    this.error.set(null);

    try {
      const updated = await firstValueFrom(this.api.updateStep(payload));
      this.stepsState.set(this.stepsState().map((s) => (s.id === stepId ? updated : s)));
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to update step");
    } finally {
      this.saving.set(false);
    }
  }

  /**
   * Upload script for currently selected step.
   * PUT /api/Step/script { stepId, script }
   */
  async uploadSelectedStepScript(script: string) {
    const step = this.selectedStep();
    if (!step) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.uploadStepScript({ stepId: step.id, script }));
      // refresh steps so runnable flag updates
      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to upload script");
    } finally {
      this.saving.set(false);
    }
  }
  async runWorkflow(extension: string) {
    const wf = this.workflow();
    if (!wf?.id) return;

    this.running.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.api.runWorkflow({ workflowId: wf.id, extension }));
      this.lastRun.set(res);
      this.lastRunExtension.set(extension);

      // persist to local history (so Runs page can show multiple tables)
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
