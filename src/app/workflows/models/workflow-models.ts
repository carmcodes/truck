export type Id = number;

/* =======================
   Workflow
   ======================= */

/* =======================
   Run workflow
   ======================= */

export interface RunWorkflowRequest {
  workflowId: Id;
  extension: string; // ✅ required by new API
}

export interface RunStepRunDto {
  stepId: Id;
  stepName: string;
  status: boolean;
  cached: boolean;
  logs: string; // API says string
  outputs: {
    variables: Record<string, unknown>;
  };
  exportFile: unknown | null;
}

export interface RunWorkflowResponse {
  workflowId: Id;
  stepRuns: RunStepRunDto[];
}


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

/**
 * PUT /api/Workflow/run
 * { workflowId: number }
 */
export interface RunWorkflowRequest {
  workflowId: Id;
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

/**
 * POST /api/Step (includes script)
 */
export interface CreateStepRequest {
  name: string;
  description: string;
  cacheable: boolean;
  workflowId: Id;
  script: string;
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

/**
 * PUT /api/Step/input (multipart/form-data)
 * Fields: stepId (number) + file (File)
 * Response: { inputs: { ... } }
 */
export type StepInputs = Record<string, unknown>;

export interface UploadStepInputResponse {
  inputs: StepInputs;
}

/**
 * DELETE /api/Workflow/{workflowId}/Step
 * Deletes the final step of the workflow.
 */
export type DeleteLastStepResponse = void;
