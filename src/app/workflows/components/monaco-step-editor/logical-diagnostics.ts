import * as monaco from "monaco-editor";

const IDENT = `[a-zA-Z_][a-zA-Z0-9_]*`;
const ASSIGNMENT = new RegExp(`^\\s*(${IDENT})\\s*=\\s*.+\\s*$`);
const FUNC_CALL = new RegExp(`^\\s*(${IDENT})\\s*\\((.*)\\)\\s*$`);

export function applyLogicalDiagnostics(
  model: monaco.editor.ITextModel
): monaco.editor.IMarkerData[] {
  const markers: monaco.editor.IMarkerData[] = [];
  const lines = model.getLinesContent();

  lines.forEach((line, i) => {
    const lineNumber = i + 1;
    const trimmed = line.trim();
    if (!trimmed) return;

    // if/while must have '{' on same line per your grammar (block starts immediately)
    if (trimmed.startsWith("if ")) {
      if (!trimmed.includes("{"))
        markers.push(lineError(lineNumber, line, "Missing '{' after if condition"));
      return;
    }

    if (trimmed.startsWith("while ")) {
      if (!trimmed.includes("{"))
        markers.push(lineError(lineNumber, line, "Missing '{' after while condition"));
      return;
    }

    // ✅ valid statements
    if (ASSIGNMENT.test(trimmed)) return; // i=0 works
    if (FUNC_CALL.test(trimmed)) return;

    markers.push(lineError(lineNumber, line, "Invalid statement"));
  });

  return markers;
}

function lineError(
  lineNumber: number,
  line: string,
  message: string
): monaco.editor.IMarkerData {
  return {
    severity: monaco.MarkerSeverity.Error,
    message,
    startLineNumber: lineNumber,
    startColumn: 1,
    endLineNumber: lineNumber,
    endColumn: line.length + 1,
    source: "logic",
  };
}
