import * as monaco from 'monaco-editor';

export type CompletionContextKind =
  | 'StartOfLine'
  | 'IfCondition'
  | 'WhileCondition'
  | 'General';

export interface CompletionContext {
  kind: CompletionContextKind;
}

export function detectContextFromGrammar(
  model: monaco.editor.ITextModel,
  position: monaco.Position
): CompletionContext {

  const line = model.getLineContent(position.lineNumber);

  const beforeCursor = line.slice(0, position.column - 1);

  if (beforeCursor.trim() === '') {
    return {kind: 'StartOfLine'};
  }

  if (isInsideString(beforeCursor)) {
    return {kind: 'General'};
  }

  const normalized = beforeCursor.trim().replace(/\s+/g, ' ');

  if (
    normalized.startsWith('if ') &&
    isKeywordBoundary(normalized, 0, 'if') &&
    !normalized.includes('{')
  ) {
    return {kind: 'IfCondition'};
  }

  if (
    normalized.startsWith('while ') &&
    isKeywordBoundary(normalized, 0, 'while') &&
    !normalized.includes('{')
  ) {
    return {kind: 'WhileCondition'};
  }
  return {kind: 'General'};
}

function isKeywordBoundary(
  text: string,
  start: number,
  keyword: string
): boolean {
  const before = start > 0 ? text[start - 1] : ' ';
  const after = text[start + keyword.length] ?? ' ';
  const isIdent = (c: string) => /[a-zA-Z0-9_]/.test(c);
  return !isIdent(before) && !isIdent(after);
}

function isInsideString(prefix: string): boolean {
  let inDouble = false;
  let inSingle = false;

  for (let i = 0; i < prefix.length; i++) {
    const ch = prefix[i];
    const prev = i > 0 ? prefix[i - 1] : '';

    if (ch === '"' && prev !== '\\' && !inSingle) {
inDouble = !inDouble;
}
    if (ch === "'" && prev !== '\\' && !inDouble) {
inSingle = !inSingle;
}
  }

  return inDouble || inSingle;
}
