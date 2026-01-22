// src/app/workflows/models/workflow-models.ts

export type Id = number;

/* =======================
   Workflow
   ======================= */

export interface WorkflowListItemDto {
  id: Id;
  name: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDto {
  id: Id;
  name: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetWorkflowsResponse {
  workflows: WorkflowListItemDto[];
}

export interface CreateWorkflowRequest {
  name: string;
  description: string;
}

export interface UpdateWorkflowRequest {
  id: Id;
  name: string;
  description: string;
  version: number;
}

export interface ExportTypeDto {
  name: string;
  extension: string; // ".txt", ".json"
}

/* =======================
   Step
   ======================= */

export interface StepDto {
  id: Id;
  name: string;
  alias: string;
  description: string;
  cacheable: boolean;
  runnable: boolean;
}

export interface GetStepsResponse {
  steps: StepDto[];
}

export interface CreateStepRequest {
  name: string;
  description: string;
  cacheable: boolean;
  script: string;
  alias: string;
  workflowId: Id;
}

export interface UpdateStepRequest {
  name: string;
  description: string;
  cacheable: boolean;
  stepId: Id;
  alias: string;
}

export interface UploadStepScriptRequest {
  stepId: Id;
  script: string;
  includedOutputs: string[]; // ✅ new
}

export interface UploadStepScriptResponse {
  status: string; // "successfully uploaded script"
}

export interface UploadStepInputResponse {
  inputs: Record<string, unknown>;
}

/* =======================
   Run
   ======================= */

export interface RunWorkflowRequest {
  workflowId: Id;
  extension: string;
}

export interface RunStepRunDto {
  stepId: Id;
  stepName: string;
  status: boolean;
  cached: boolean;
  logs: string;
  outputs: {
    variables: Record<string, unknown>; // e.g. { "Inputs.ALIAS.var1": 888 }
  };
  exportFile: string | null;
}

export interface RunWorkflowResponse {
  workflowId: Id;
  stepRuns: RunStepRunDto[];
}

/* =======================
   Delete last step
   ======================= */

export interface DeleteLastStepResponse {
  message: string; // "successfully deleted step 3."
}
