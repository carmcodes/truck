import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as monaco from "monaco-editor";

import { registerWorkflowLanguage } from "./monaco-language";
import { registerWorkflowCompletion } from "./monaco-completion";
import { applyWorkflowDiagnostics } from "./monaco-diagnostics";
import { extractVarsFromCode } from "./script-vars";

/**
 * WorkflowVar no longer comes from backend models.
 * It's a UI-only concept for Monaco completion/diagnostics.
 */
export type VarKind = "bool" | "number" | "string" | "object" | "array" | "unknown";
export interface WorkflowVar {
  name: string;
  kind: VarKind;
}

@Component({
  standalone: true,
  selector: "app-monaco-step-editor",
  template: `<div #host class="monaco-host"></div>`,
  styleUrls: ["./monaco-step-editor.css"],
})
export class MonacoStepEditorComponent implements AfterViewInit, OnChanges {
  @ViewChild("host", { static: true }) host!: ElementRef<HTMLDivElement>;

  @Input() code = "";
  @Input() availableVariables: WorkflowVar[] = [];

  @Output() codeChange = new EventEmitter<string>();

  private editor?: monaco.editor.IStandaloneCodeEditor;
  private model?: monaco.editor.ITextModel;
  private disposers: monaco.IDisposable[] = [];

  private codeVars: WorkflowVar[] = [];
  private diagTimer: any;

  private getAllVars(): WorkflowVar[] {
    // external vars (uploaded inputs etc.) + local script vars
    const map = new Map<string, WorkflowVar>();

    // local first, external can override kind if known
    for (const v of this.codeVars ?? []) map.set(v.name, v);
    for (const v of this.availableVariables ?? []) map.set(v.name, v);

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  ngAfterViewInit(): void {
    registerWorkflowLanguage();

    this.model = monaco.editor.createModel(this.code ?? "", "workflowLang");

    this.editor = monaco.editor.create(this.host.nativeElement, {
      model: this.model,
      automaticLayout: true,
      minimap: { enabled: false },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
    });

    // initial local vars
    this.codeVars = extractVarsFromCode(this.code ?? "") as WorkflowVar[];

    // register completion (uses merged vars getter)
    registerWorkflowCompletion(() => this.getAllVars());

    this.disposers.push(
      this.model.onDidChangeContent(() => {
        const val = this.model?.getValue() ?? "";
        this.codeChange.emit(val);

        // update local vars so newly declared vars appear
        this.codeVars = extractVarsFromCode(val) as WorkflowVar[];

        // refresh completion provider with latest getter
        registerWorkflowCompletion(() => this.getAllVars());

        // diagnostics (debounced)
        clearTimeout(this.diagTimer);
        this.diagTimer = setTimeout(() => {
          if (this.model) applyWorkflowDiagnostics(this.model, this.getAllVars());
        }, 200);
      })
    );

    // initial diagnostics
    applyWorkflowDiagnostics(this.model, this.getAllVars());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.model) return;

    if (changes["code"] && typeof this.code === "string" && this.code !== this.model.getValue()) {
      this.model.setValue(this.code);
      this.codeVars = extractVarsFromCode(this.code ?? "") as WorkflowVar[];
    }

    if (changes["availableVariables"]) {
      // update completion & diagnostics when external vars change
      registerWorkflowCompletion(() => this.getAllVars());
      applyWorkflowDiagnostics(this.model, this.getAllVars());
    }
  }

  ngOnDestroy(): void {
    this.disposers.forEach((d) => d.dispose());
    this.editor?.dispose();
    this.model?.dispose();
  }
}
