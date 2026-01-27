import * as monaco from 'monaco-editor';
import {applyLogicalDiagnostics} from './logical-diagnostics';
import {applyAntlrDiagnostics} from './antlr-diagnostics';
import type {WorkflowVar} from './workflow-vars';
import {inject, Injectable} from '@angular/core';
import {WorkflowsFacade} from '../../services/workflows.facade';

@Injectable({providedIn: 'root'})
export class MonacoDiagnostics {

  facade = inject(WorkflowsFacade);
  applyWorkflowDiagnostics(model: monaco.editor.ITextModel, vars: WorkflowVar[]) {
    const logical = applyLogicalDiagnostics(model);

    if (logical.length) {
      monaco.editor.setModelMarkers(model, 'workflow', logical);
      //this.facade.bool.set(true);
      return;
    }
    const antlr = applyAntlrDiagnostics(model);
    monaco.editor.setModelMarkers(model, 'workflow', antlr);
  }
}
