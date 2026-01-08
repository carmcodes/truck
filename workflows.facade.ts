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
} from "../models/workflow-models";
import {WorkflowApi} from './workflows.api';

@Injectable({ providedIn: "root" })
export class WorkflowsFacade {
  private api = inject(WorkflowApi);

  // state
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly workflow = signal<WorkflowDto | null>(null);
  readonly stepsState = signal<StepDto[]>([]);
  readonly selectedStepId = signal<Id | null>(null);

  // derived
  readonly steps = computed(() => this.stepsState());
  readonly selectedStep = computed(() => {
    const id = this.selectedStepId();
    return id == null ? null : this.stepsState().find((s) => s.id === id) ?? null;
  });

  // ------------ loading / init ------------
  /**
   * Backend only provides GET /api/Workflow (list), not GET by id.
   * So we load list -> find item -> map to WorkflowDto (description may be missing) -> load steps.
   */
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
        this.error.set("Workflow not found");
        return;
      }

      // list DTO doesn't include description, so default to empty string
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
    // Since backend assigns ids, keep id=0 until created.
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
    this.selectedStepId.set(steps[0]?.id ?? null);
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

  // ------------ steps (server-backed) ------------
  async addStep() {
    const wf = this.workflow();
    if (!wf) return;

    // must exist on backend first
    if (!wf.id) {
      this.error.set("Save the workflow before adding steps.");
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const payload: CreateStepRequest = {
        name: `Step ${this.stepsState().length + 1}`,
        description: "",
        cacheable: false,
        workflowId: wf.id,
      };

      const created = await firstValueFrom(this.api.createStep(payload));
      const next = [...this.stepsState(), created];

      this.stepsState.set(next);
      this.selectedStepId.set(created.id);
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to add step");
    } finally {
      this.saving.set(false);
    }
  }

  async patchStep(stepId: Id, patch: Partial<StepDto>) {
    const current = this.stepsState().find((s) => s.id === stepId);
    if (!current) return;

    // Only fields supported by PUT /api/Step: name, description, cacheable, stepId
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
      this.stepsState.set(
        this.stepsState().map((s) => (s.id === stepId ? updated : s))
      );
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to update step");
    } finally {
      this.saving.set(false);
    }
  }

  selectStep(stepId: Id) {
    this.selectedStepId.set(stepId);
  }

  async uploadSelectedStepScript(script: string) {
    const step = this.selectedStep();
    if (!step) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(
        this.api.uploadStepScript({
          stepId: step.id,
          script,
        })
      );

      // runnable is returned by backend in StepDto; refresh step list to get updated runnable flag
      await this.refreshSteps();
    } catch (e: any) {
      this.error.set(e?.message ?? "Failed to upload script");
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
      // Create
      if (!wf.id || wf.id === 0) {
        const payload: CreateWorkflowRequest = {
          name: wf.name,
          description: wf.description,
        };

        const created = await firstValueFrom(this.api.createWorkflow(payload));
        this.workflow.set(created);
        // steps belong to workflowId, so after create we can start adding steps
        this.stepsState.set([]);
        this.selectedStepId.set(null);
        return;
      }

      // Update
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
}
