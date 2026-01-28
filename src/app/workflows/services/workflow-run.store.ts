// workflow-run.store.ts
import type {Id, RunWorkflowResponse} from '../models/workflow-models';

export type StoredRun = {
  runId: string;
  workflowId: number;
  createdAt: string;
  extension: string;
  result: any; // RunWorkflowResponse

  // ✅ already used for filtering output display
  includedOutputsSnapshot?: Record<number, string[]>;

  // ✅ uploaded json inputs by step
  inputsByStepId?: Record<number, Record<string, unknown>>;

  // ✅ NEW: declared vars per step at run time (from scripts)
  scriptVarsByStepId?: Record<number, string[]>;
};


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
