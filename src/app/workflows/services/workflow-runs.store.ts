import type { Id, RunWorkflowResponse } from "../models/workflow-models";

export interface StoredRun {
  runId: string;       // client-generated
  workflowId: Id;
  createdAt: string;   // ISO
  extension: string;
  result: RunWorkflowResponse;
}

function key(workflowId: Id) {
  return `wf:runs:${workflowId}`;
}

export function loadRuns(workflowId: Id): StoredRun[] {
  const raw = localStorage.getItem(key(workflowId));
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as StoredRun[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveRun(workflowId: Id, run: StoredRun) {
  const prev = loadRuns(workflowId);
  const next = [run, ...prev]; // newest first
  localStorage.setItem(key(workflowId), JSON.stringify(next));
}

export function clearRuns(workflowId: Id) {
  localStorage.removeItem(key(workflowId));
}
