import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild, OnDestroy, inject
} from '@angular/core';
import * as monaco from 'monaco-editor';

import {registerWorkflowLanguage} from './monaco-language';
import {registerWorkflowCompletion} from './monaco-completion';
import {MonacoDiagnostics} from './monaco-diagnostics';
import {extractVarsFromCode} from './script-vars';
import type {WorkflowVar} from './workflow-vars';


@Component({
  standalone: true,
  selector: 'app-monaco-step-editor',
  template: '<div #host class="monaco-host"></div>',
  styleUrls: ['./monaco-step-editor.scss']
})
export class MonacoStepEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('host', {static: true}) host!: ElementRef<HTMLDivElement>;

  @Input() code = '';
  @Input() availableVariables: WorkflowVar[] = [];

  @Output() codeChange = new EventEmitter<string>();
  @Output() syntaxErrorsChange = new EventEmitter<string[]>();

  monacodiag = inject(MonacoDiagnostics);

  private editor?: monaco.editor.IStandaloneCodeEditor;
  private model?: monaco.editor.ITextModel;
  private disposers: monaco.IDisposable[] = [];

  private codeVars: WorkflowVar[] = [];
  private diagTimer: any;

  private emitErrors() {
    if (!this.model) {
      return;
    }
    const markers = monaco.editor.getModelMarkers({
      owner: 'workflow',
      resource: this.model.uri
    });

    const errors = markers
      .filter(m => m.severity === monaco.MarkerSeverity.Error)
      .map(m => `Line ${m.startLineNumber}:${m.startColumn} — ${m.message}`);

    this.syntaxErrorsChange.emit(errors);
  }


  private getAllVars(): WorkflowVar[] {
    const map = new Map<string, WorkflowVar>();

    for (const v of this.codeVars ?? []) {
      map.set(v.name, v);
    }
    for (const v of this.availableVariables ?? []) {
      map.set(v.name, v);
    }

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  ngAfterViewInit(): void {
    registerWorkflowLanguage();

    this.model = monaco.editor.createModel(this.code ?? '', 'workflowLang');

    this.editor = monaco.editor.create(this.host.nativeElement, {
      model: this.model,
      automaticLayout: true,
      minimap: {enabled: false},
      suggestOnTriggerCharacters: true,
      quickSuggestions: true
    });

    this.codeVars = extractVarsFromCode(this.code ?? '') as WorkflowVar[];

    registerWorkflowCompletion(() => this.getAllVars());

    this.disposers.push(
      this.model.onDidChangeContent(() => {
        const val = this.model?.getValue() ?? '';
        this.codeChange.emit(val);
        this.codeVars = extractVarsFromCode(val) as WorkflowVar[];
        registerWorkflowCompletion(() => this.getAllVars());

        clearTimeout(this.diagTimer);
        this.diagTimer = setTimeout(() => {
          if (this.model) {
            this.monacodiag.applyWorkflowDiagnostics(this.model, this.getAllVars());
          }
        }, 200);
      })
    );

    this.monacodiag.applyWorkflowDiagnostics(this.model, this.getAllVars());
    this.diagTimer = setTimeout(() => {
      this.monacodiag.applyWorkflowDiagnostics(this.model!, this.getAllVars());
      this.emitErrors();
    }, 200);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.model) {
      return;
    }

    if (changes['code'] && typeof this.code === 'string' && this.code !== this.model.getValue()) {
      this.model.setValue(this.code);
      this.codeVars = extractVarsFromCode(this.code ?? '') as WorkflowVar[];
    }

    if (changes['availableVariables']) {
      registerWorkflowCompletion(() => this.getAllVars());
      this.monacodiag.applyWorkflowDiagnostics(this.model, this.getAllVars());
    }
  }

  ngOnDestroy(): void {
    this.disposers.forEach((d) => d.dispose());
    this.editor?.dispose();
    this.model?.dispose();
  }
}
