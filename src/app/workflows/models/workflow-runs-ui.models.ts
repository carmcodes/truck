import type { Id, StepDto } from "./workflow-models";

export type RunStatus = "Succeeded" | "Failed";

export interface StepRunSnapshot {
  stepId: Id;
  name: string;

  // variables visible in that step (inputs + prior step vars + current step vars)
  variables: string[];

  // placeholders until backend provides real data
  outputs: Record<string, unknown>;
  logs: string[];
}

export interface WorkflowRunSnapshot {
  runId: string;      // client-generated
  workflowId: Id;
  createdAt: string;  // ISO
  status: RunStatus;

  steps: StepRunSnapshot[];
}
