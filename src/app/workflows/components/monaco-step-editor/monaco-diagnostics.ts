import * as monaco from "monaco-editor";
import { applyLogicalDiagnostics } from "./logical-diagnostics";
import { applyAntlrDiagnostics } from "./antlr-diagnostics";
import type { WorkflowVar } from "./workflow-vars";

export function applyWorkflowDiagnostics(model: monaco.editor.ITextModel, vars: WorkflowVar[]) {
  const logical = applyLogicalDiagnostics(model);
  if (logical.length) {
    monaco.editor.setModelMarkers(model, "workflow", logical);
    return;
  }
  const antlr = applyAntlrDiagnostics(model);
  monaco.editor.setModelMarkers(model, "workflow", antlr);
}
