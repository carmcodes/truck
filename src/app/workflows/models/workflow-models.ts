export type Id = number;

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
  extension: string;
}

export interface StepDto {
  id: Id;
  name: string;
  alias: string;
  description: string;
  cacheable: boolean;
  runnable: boolean;
  stepNumber: number;
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
  includedOutputs: string[];
}

export interface UploadStepScriptResponse {
  status: string;
}

export interface UploadStepInputResponse {
  inputs: Record<string, unknown>;
}

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
    variables: Record<string, unknown>;
  };
  exportFile: string | null;
}

export interface RunWorkflowResponse {
  workflowId: Id;
  stepRuns: RunStepRunDto[];
}

export interface DeleteLastStepResponse {
  message: string;
}