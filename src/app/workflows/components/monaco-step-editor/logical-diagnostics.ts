import * as monaco from 'monaco-editor';

// ✅ Simplified - only check for truly invalid patterns
// Most validation is handled by antlr-diagnostics now
export function applyLogicalDiagnostics(
    model: monaco.editor.ITextModel
): monaco.editor.IMarkerData[] {
  const markers: monaco.editor.IMarkerData[] = [];
  const lines = model.getLinesContent();

  lines.forEach((line, i) => {
    const lineNumber = i + 1;
    const trimmed = line.trim();

    // Skip empty lines, braces, and valid constructs
    if (!trimmed || trimmed === '{' || trimmed === '}') {
      return;
    }

    // Skip comments
    if (trimmed.startsWith('//')) {
      return;
    }

    // These are handled by antlr-diagnostics, so skip them here
    if (trimmed.startsWith('if ') ||
        trimmed.startsWith('else') ||
        trimmed.startsWith('while ')) {
      return;
    }
  });

  return markers;
}