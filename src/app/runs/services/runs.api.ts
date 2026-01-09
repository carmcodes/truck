import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export type StepRunStatus = 'Queued'|'Running'|'Succeeded'|'Failed'|'Skipped'|'Cached';

export interface RunDto {
  id: string;
  workflowId: string;
  workflowVersion: number;
  status: 'Running'|'Succeeded'|'Failed';
  startedAt: string;
  finishedAt?: string;
}

export interface RunStepDto {
  stepId: string;
  name: string;
  status: StepRunStatus;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
  cached?: boolean;
  errorMessage?: string;
}

export interface StepLogsDto { stepId: string; lines: string[]; }
export interface StepOutputsDto { stepId: string; outputs: Record<string, unknown>; }

@Injectable({ providedIn: 'root' })
export class RunsApi {
  private http = inject(HttpClient);

  getRun(runId: string) {
    return this.http.get<RunDto>(`/runs/${runId}`);
  }

  getSteps(runId: string) {
    return this.http.get<RunStepDto[]>(`/runs/${runId}/steps`);
  }

  getStepLogs(runId: string, stepId: string) {
    return this.http.get<StepLogsDto>(`/runs/${runId}/steps/${stepId}/logs`);
  }

  getStepOutputs(runId: string, stepId: string) {
    return this.http.get<StepOutputsDto>(`/runs/${runId}/steps/${stepId}/outputs`);
  }
}
