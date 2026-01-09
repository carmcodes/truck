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

  async uploadSelectedStepInput(file: File) {
    const step = this.selectedStep();
    if (!step) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.api.uploadStepInput(step.id, file));

      // store inputs per step
      const map = { ...this.stepInputsByStepId() };
      map[step.id] = res.inputs ?? {};
      this.stepInputsByStepId.set(map);
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to upload step input");
    } finally {
      this.saving.set(false);
    }
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


  // ------------ run workflow ------------
  async runWorkflow() {
    const wf = this.workflow();
    if (!wf || !wf.id) return;

    this.running.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.runWorkflow({ workflowId: wf.id }));
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to run workflow");
    } finally {
      this.running.set(false);
    }
  }
}
