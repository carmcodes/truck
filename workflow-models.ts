export type Id = number;

/* =======================
   Workflow
   ======================= */

export interface WorkflowListItemDto {
  id: Id;
  name: string;
  version: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
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

/* =======================
   Step
   ======================= */

export interface StepDto {
  id: Id;
  name: string;
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
  workflowId: Id;
}

export interface UpdateStepRequest {
  name: string;
  description: string;
  cacheable: boolean;
  stepId: Id;
}

export interface UploadStepScriptRequest {
  stepId: Id;
  script: string;
}

export interface UploadStepScriptResponse {
  status: string;
}
