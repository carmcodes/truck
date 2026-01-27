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
import { saveRun } from "./workflow-run.store";

@Injectable({ providedIn: "root" })
export class WorkflowsFacade {
  private api = inject(WorkflowApi);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly running = signal(false);
  readonly error = signal<string | null>(null);

  readonly workflow = signal<WorkflowDto | null>(null);
  readonly stepsState = signal<StepDto[]>([]);
  readonly selectedStepId = signal<Id | null>(null);

  readonly stepScriptByStepId = signal<Record<number, string>>({});

  readonly stepVarsByStepId = signal<Record<number, Record<string, WorkflowVar>>>({});

  readonly inputsByStepId = signal<Record<number, Record<string, unknown>>>({});

  readonly stepSyntaxErrors = signal<Record<number, string[]>>({});

  readonly includedOutputsByStepId = signal<Record<number, string[]>>({});

  readonly stepScriptSavedStatus = signal<Record<number, boolean>>({});

  readonly exportTypes = signal<ExportTypeDto[]>([]);

  readonly steps = computed(() => this.stepsState());

  readonly selectedStep = computed(() => {
    const id = this.selectedStepId();
    return id == null ? null : this.stepsState().find(s => s.id === id) ?? null;
  });

  // localStorage keys
  private getInputsStorageKey(workflowId: number): string {
    return `workflow_${workflowId}_inputs`;
  }

  private getIncludedOutputsStorageKey(workflowId: number): string {
    return `workflow_${workflowId}_included_outputs`;
  }

  private getScriptSavedStatusStorageKey(workflowId: number): string {
    return `workflow_${workflowId}_script_saved_status`;
  }

  // Load inputs from localStorage
  private loadInputsFromStorage(workflowId: number): Record<number, Record<string, unknown>> {
    try {
      const key = this.getInputsStorageKey(workflowId);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('Failed to load inputs from storage', e);
      return {};
    }
  }

  // Save inputs to localStorage
  private saveInputsToStorage(workflowId: number, inputs: Record<number, Record<string, unknown>>) {
    try {
      const key = this.getInputsStorageKey(workflowId);
      localStorage.setItem(key, JSON.stringify(inputs));
    } catch (e) {
      console.warn('Failed to save inputs to storage', e);
    }
  }

  // Load included outputs from localStorage
  private loadIncludedOutputsFromStorage(workflowId: number): Record<number, string[]> {
    try {
      const key = this.getIncludedOutputsStorageKey(workflowId);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('Failed to load included outputs from storage', e);
      return {};
    }
  }

  // Save included outputs to localStorage
  private saveIncludedOutputsToStorage(workflowId: number, includedOutputs: Record<number, string[]>) {
    try {
      const key = this.getIncludedOutputsStorageKey(workflowId);
      localStorage.setItem(key, JSON.stringify(includedOutputs));
    } catch (e) {
      console.warn('Failed to save included outputs to storage', e);
    }
  }

  // Load script saved status from localStorage
  private loadScriptSavedStatusFromStorage(workflowId: number): Record<number, boolean> {
    try {
      const key = this.getScriptSavedStatusStorageKey(workflowId);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('Failed to load script saved status from storage', e);
      return {};
    }
  }

  // Save script saved status to localStorage
  private saveScriptSavedStatusToStorage(workflowId: number, status: Record<number, boolean>) {
    try {
      const key = this.getScriptSavedStatusStorageKey(workflowId);
      localStorage.setItem(key, JSON.stringify(status));
    } catch (e) {
      console.warn('Failed to save script saved status to storage', e);
    }
  }

  private getStepIndexById(stepId: number): number {
    return this.stepsState().findIndex(s => s.id === stepId);
  }

  getInputsVisibleAtStep(stepId: number): Record<string, unknown> {
    const idx = this.getStepIndexById(stepId);
    if (idx < 0) return {};

    const steps = this.stepsState();
    const byStep = this.inputsByStepId();

    const merged: Record<string, unknown> = {};
    for (let i = 0; i <= idx; i++) {
      const sid = steps[i]?.id;
      if (!sid) continue;
      Object.assign(merged, byStep[sid] ?? {});
    }
    return merged;
  }

  readonly availableVariablesForSelectedStep = computed<WorkflowVar[]>(() => {
    const steps = this.stepsState();
    const selectedId = this.selectedStepId();
    if (selectedId == null) return [];

    const idx = steps.findIndex(s => s.id === selectedId);
    if (idx < 0) return [];

    const out: WorkflowVar[] = [];

    const byStep = this.inputsByStepId();
    for (let i = 0; i <= idx; i++) {
      const step = steps[i];
      const stepInputs = byStep[step.id] ?? {};
      const stepAlias = step.alias || `step${i + 1}`;

      for (const varName of Object.keys(stepInputs)) {
        out.push({
          name: `Inputs.${stepAlias}.${varName}`,
          kind: "unknown",
          source: "input"
        } as any);
      }
    }

    const varsByStep = this.stepVarsByStepId();
    for (let i = 0; i <= idx; i++) {
      const sid = steps[i].id;
      const m = varsByStep[sid];
      if (!m) continue;
      for (const v of Object.values(m)) out.push(v);
    }

    const uniq = new Map<string, WorkflowVar>();
    for (const v of out) uniq.set(v.name, v);
    return [...uniq.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly lastRun = signal<RunWorkflowResponse | null>(null);
  readonly lastRunExtension = signal<string>("");

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

  isStepScriptSaved(stepId: number): boolean {
    return this.stepScriptSavedStatus()[stepId] ?? false;
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

    this.stepScriptByStepId.set({});
    this.stepVarsByStepId.set({});
    this.stepSyntaxErrors.set({});
    this.includedOutputsByStepId.set({});
    this.inputsByStepId.set({});
    this.stepScriptSavedStatus.set({});
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

  getStepScript(stepId: number): string {
    return this.stepScriptByStepId()[stepId] ?? "";
  }

  patchWorkflow(patch: Partial<WorkflowDto>) {
    const wf = this.workflow();
    if (!wf) return;

    this.workflow.set({
      ...wf,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }

  selectStep(stepId: Id) {
    this.selectedStepId.set(stepId);
  }

  getStepDisplayIndex(stepId: Id): number {
    const index = this.stepsState().findIndex(step => step.id === stepId);
    return index >= 0 ? index + 1 : 0;
  }

  getStepInputs(stepId: number): Record<string, unknown> {
    return this.inputsByStepId()[stepId] ?? {};
  }

  async addStep(script: string = "") {
    let wf = this.workflow();
    if (!wf) return;

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
        alias: `step${nextIndex}`,
        workflowId: wf.id,
      };

      const created = await firstValueFrom(this.api.createStep(payload));

      console.log('📝 Created step:', created);

      this.stepsState.set([...this.stepsState(), created]);
      this.selectedStepId.set(created.id);

      console.log('✅ Selected step ID set to:', created.id);
      console.log('✅ Selected step:', this.selectedStep());

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
      alias: patch.alias ?? current.alias,
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

  setIncludedOutputs(stepId: number, outputs: string[]) {
    const wf = this.workflow();
    if (!wf?.id) return;

    const next = {
      ...this.includedOutputsByStepId(),
      [stepId]: outputs,
    };
    this.includedOutputsByStepId.set(next);

    this.saveIncludedOutputsToStorage(wf.id, next);

    console.log(`✅ Included outputs for step ${stepId}:`, outputs);
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

      const wf = this.workflow();
      if (!wf?.id) return;

      // Mark this step's script as saved
      const newStatus = {
        ...this.stepScriptSavedStatus(),
        [step.id]: true
      };
      this.stepScriptSavedStatus.set(newStatus);

      // Persist to localStorage
      this.saveScriptSavedStatusToStorage(wf.id, newStatus);

      console.log(`✅ Script saved and locked for step ${step.id}`);

      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to save script");
    } finally {
      this.saving.set(false);
    }
  }

  unlockStepScript(stepId: number) {
    const wf = this.workflow();
    if (!wf?.id) return;

    const newStatus = {
      ...this.stepScriptSavedStatus(),
      [stepId]: false
    };
    this.stepScriptSavedStatus.set(newStatus);

    // Persist to localStorage
    this.saveScriptSavedStatusToStorage(wf.id, newStatus);

    console.log(`🔓 Script unlocked for step ${stepId}`);
  }

  clearStepInputs(stepId: number) {
    const wf = this.workflow();
    if (!wf?.id) return;

    const next = { ...this.inputsByStepId() };
    delete next[stepId];
    this.inputsByStepId.set(next);

    this.saveInputsToStorage(wf.id, next);

    console.log(`🗑️ Cleared inputs for step ${stepId}`);
  }

  async uploadSelectedStepInput(file: File) {
    const step = this.selectedStep();
    const wf = this.workflow();
    if (!step || !wf?.id) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.api.uploadStepInput(step.id, file));

      const next = { ...this.inputsByStepId() };
      next[step.id] = { ...(next[step.id] ?? {}), ...(res.inputs ?? {}) };
      this.inputsByStepId.set(next);

      this.saveInputsToStorage(wf.id, next);

    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to upload input");
    } finally {
      this.saving.set(false);
    }
  }

  async loadExportTypes() {
    try {
      const types = await firstValueFrom(this.api.getExportTypes());
      this.exportTypes.set(types ?? []);
    } catch {
      this.exportTypes.set([]);
    }
  }

  async runWorkflow(extension: string) {
    const wf = this.workflow();
    if (!wf?.id) return;

    if (this.hasAnySyntaxErrors()) {
      this.error.set("Fix syntax errors before running. " + (this.getFirstSyntaxError() ?? ""));
      return;
    }

    // Check if all steps with scripts are saved
    const stepsWithScripts = this.stepsState().filter(step => {
      const script = this.getStepScript(step.id);
      return script && script.trim() !== '';
    });

    const unsavedSteps = stepsWithScripts.filter(step => !this.isStepScriptSaved(step.id));

    if (unsavedSteps.length > 0) {
      this.error.set(
        `Please save scripts for: ${unsavedSteps.map(s => s.name).join(', ')}`
      );
      return;
    }

    this.running.set(true);
    this.error.set(null);

    try {
      console.log('▶️ Running workflow...');
      const res = await firstValueFrom(this.api.runWorkflow({ workflowId: wf.id, extension }));
      this.lastRun.set(res);
      this.lastRunExtension.set(extension);

      // Capture the included outputs snapshot at run time
      const includedOutputsSnapshot: Record<number, string[]> = {};
      for (const step of this.stepsState()) {
        const outputs = this.getIncludedOutputs(step.id);
        includedOutputsSnapshot[step.id] = outputs;
      }

      console.log('📸 Included outputs snapshot:', includedOutputsSnapshot);
      console.log('📊 Run result:', res);

      saveRun(wf.id, {
        runId: crypto.randomUUID(),
        workflowId: wf.id,
        createdAt: new Date().toISOString(),
        extension,
        result: res,
        includedOutputsSnapshot,
      });

      console.log('✅ Run saved successfully');
    } catch (e: any) {
      console.error('❌ Run failed:', e);
      this.error.set(e?.message ?? "Failed to run workflow");
    } finally {
      this.running.set(false);
    }
  }

  // Add localStorage methods for scripts
  private getScriptsStorageKey(workflowId: number): string {
    return `workflow_${workflowId}_scripts`;
  }

  private loadScriptsFromStorage(workflowId: number): Record<number, string> {
    try {
      const key = this.getScriptsStorageKey(workflowId);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('Failed to load scripts from storage', e);
      return {};
    }
  }

  private saveScriptsToStorage(workflowId: number, scripts: Record<number, string>) {
    try {
      const key = this.getScriptsStorageKey(workflowId);
      localStorage.setItem(key, JSON.stringify(scripts));
    } catch (e) {
      console.warn('Failed to save scripts to storage', e);
    }
  }

// Update loadWorkflow to load scripts
  async loadWorkflow(workflowId: Id) {
    this.loading.set(true);
    this.error.set(null);

    this.stepVarsByStepId.set({});
    this.stepSyntaxErrors.set({});

    try {
      const listRes = await firstValueFrom(this.api.getWorkflows());
      const item = listRes.workflows.find(w => w.id === workflowId);

      if (!item) {
        this.workflow.set(null);
        this.stepsState.set([]);
        this.selectedStepId.set(null);
        this.inputsByStepId.set({});
        this.includedOutputsByStepId.set({});
        this.stepScriptSavedStatus.set({});
        this.stepScriptByStepId.set({});
        this.error.set("Workflow not found");
        return;
      }

      this.workflow.set(this.mapListItemToWorkflowDto(item));

      // Load all persisted data from localStorage
      const storedInputs = this.loadInputsFromStorage(workflowId);
      const storedIncludedOutputs = this.loadIncludedOutputsFromStorage(workflowId);
      const storedScriptSavedStatus = this.loadScriptSavedStatusFromStorage(workflowId);
      const storedScripts = this.loadScriptsFromStorage(workflowId); // ✅ Load scripts

      this.inputsByStepId.set(storedInputs);
      this.includedOutputsByStepId.set(storedIncludedOutputs);
      this.stepScriptSavedStatus.set(storedScriptSavedStatus);
      this.stepScriptByStepId.set(storedScripts); // ✅ Set scripts

      console.log('📂 Loaded scripts:', storedScripts);
      console.log('📂 Loaded script saved status:', storedScriptSavedStatus);

      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to load workflow");
    } finally {
      this.loading.set(false);
    }
  }

// Update onStepCodeChange to persist scripts
  onStepCodeChange(stepId: number, code: string) {
    const wf = this.workflow();
    if (!wf?.id) return;

    const newScripts = { ...this.stepScriptByStepId(), [stepId]: code };
    this.stepScriptByStepId.set(newScripts);

    // ✅ Save scripts to localStorage
    this.saveScriptsToStorage(wf.id, newScripts);

    const vars = extractVarsFromCode(code);
    const map: Record<string, WorkflowVar> = {};
    for (const v of vars) map[v.name] = { ...v, source: "step", stepId } as any;

    this.stepVarsByStepId.set({ ...this.stepVarsByStepId(), [stepId]: map });
  }

// Update deleteLastStep to clean up scripts
  async deleteLastStep() {
    const wf = this.workflow();
    if (!wf?.id) return;
    if (this.stepsState().length === 0) return;

    const lastStep = this.stepsState()[this.stepsState().length - 1];

    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.deleteLastStep(wf.id));

      // Clean up localStorage for deleted step
      const newInputs = { ...this.inputsByStepId() };
      delete newInputs[lastStep.id];
      this.inputsByStepId.set(newInputs);
      this.saveInputsToStorage(wf.id, newInputs);

      const newIncludedOutputs = { ...this.includedOutputsByStepId() };
      delete newIncludedOutputs[lastStep.id];
      this.includedOutputsByStepId.set(newIncludedOutputs);
      this.saveIncludedOutputsToStorage(wf.id, newIncludedOutputs);

      const newScriptSavedStatus = { ...this.stepScriptSavedStatus() };
      delete newScriptSavedStatus[lastStep.id];
      this.stepScriptSavedStatus.set(newScriptSavedStatus);
      this.saveScriptSavedStatusToStorage(wf.id, newScriptSavedStatus);

      // ✅ Clean up scripts
      const newScripts = { ...this.stepScriptByStepId() };
      delete newScripts[lastStep.id];
      this.stepScriptByStepId.set(newScripts);
      this.saveScriptsToStorage(wf.id, newScripts);

      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to delete last step");
    } finally {
      this.saving.set(false);
    }
  }

  async saveWorkflow() {
    const wf = this.workflow();
    if (!wf) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      // First, save the workflow metadata
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

      // Save all step scripts with their included outputs
      console.log('💾 Saving all step scripts...');
      const updatedStatus = { ...this.stepScriptSavedStatus() };

      for (const step of this.stepsState()) {
        const script = this.getStepScript(step.id);
        const includedOutputs = this.getIncludedOutputs(step.id);

        // Only save if there's a script
        if (script && script.trim() !== '') {
          console.log(`💾 Saving step ${step.id} (${step.alias}):`, {
            scriptLength: script.length,
            includedOutputs
          });

          await firstValueFrom(
            this.api.uploadStepScript({ stepId: step.id, script, includedOutputs })
          );

          // Mark script as saved
          updatedStatus[step.id] = true;
        }
      }

      // Update and persist saved status for all steps
      this.stepScriptSavedStatus.set(updatedStatus);
      this.saveScriptSavedStatusToStorage(wf.id, updatedStatus);

      // ✅ Refresh steps to get updated state from backend
      await this.refreshSteps();

      console.log('✅ Workflow and all scripts saved successfully');

    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to save workflow");
    } finally {
      this.saving.set(false);
    }
  }
}
