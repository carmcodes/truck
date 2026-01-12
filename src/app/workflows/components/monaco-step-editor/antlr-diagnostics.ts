import * as monaco from 'monaco-editor';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { CollectingErrorListener } from './collecting-error-listener';
import {LanguageLexer} from '../../../antlr/LanguageLexer';
import {LanguageParser} from '../../../antlr/LanguageParser';

export function applyAntlrDiagnostics(model: monaco.editor.ITextModel): monaco.editor.IMarkerData[] {
  const text = model.getValue();

  const input = CharStreams.fromString(text);
  const lexer = new LanguageLexer(input);
  const tokens = new CommonTokenStream(lexer);
  const parser = new LanguageParser(tokens);

  lexer.removeErrorListeners();
  parser.removeErrorListeners();

  const listener = new CollectingErrorListener();
  lexer.addErrorListener(listener);
  parser.addErrorListener(listener);

  try { parser.program(); } catch {}

  // ✅ Keep only ONE error per line (first error wins)
  const byLine = new Map<number, typeof listener.errors[number]>();
  for (const e of listener.errors) {
    if (!byLine.has(e.line)) byLine.set(e.line, e);
  }

  const markers: monaco.editor.IMarkerData[] = [];

  for (const e of byLine.values()) {
    const line = clamp(e.line, 1, model.getLineCount());
    const lineLen = model.getLineLength(line);

    const startCol = clamp(e.column + 1, 1, Math.max(1, lineLen + 1));
    const endCol = clamp(startCol + 1, startCol, lineLen + 1);

    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message: normalizeAntlrMessage(e.message),
      startLineNumber: line,
      startColumn: startCol,
      endLineNumber: line,
      endColumn: endCol,
      source: 'antlr',
    });
  }

  return markers;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function normalizeAntlrMessage(msg: string) {
  return msg.replace(/^line \d+:\d+\s*/i, '').replace(/<EOF>/g, 'end of file');
}
