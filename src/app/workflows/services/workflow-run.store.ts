import type {Id, RunWorkflowResponse} from '../models/workflow-models';

export interface StoredRun {
  runId: string;
  workflowId: Id;
  createdAt: string;
  extension: string;
  result: RunWorkflowResponse;
  globalInputsSnapshot?: Record<string, unknown>;
  declaredVarsByStepIdSnapshot?: Record<string, string[]>;
  includedOutputsSnapshot?: Record<number, string[]>; // ✅ Add this line
}

function key(workflowId: Id) {
  return `wf:runs:${workflowId}`;
}

export function loadRuns(workflowId: Id): StoredRun[] {
  const raw = localStorage.getItem(key(workflowId));
  if (!raw) {
    return [];
  }
  try {
    const list = JSON.parse(raw) as StoredRun[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveRun(workflowId: Id, run: StoredRun) {
  const prev = loadRuns(workflowId);
  const next = [run, ...prev];
  localStorage.setItem(key(workflowId), JSON.stringify(next));
}

export function clearRuns(workflowId: Id) {
  localStorage.removeItem(key(workflowId));
}
