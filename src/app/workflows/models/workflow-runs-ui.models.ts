import type {Id, StepDto} from './workflow-models';

export type RunStatus = 'Succeeded' | 'Failed';

export interface StepRunSnapshot {
  stepId: Id;
  name: string;

  variables: string[];

  outputs: Record<string, unknown>;
  logs: string[];
}

export interface WorkflowRunSnapshot {
  runId: string;
  workflowId: Id;
  createdAt: string;
  status: RunStatus;
  steps: StepRunSnapshot[];
}
