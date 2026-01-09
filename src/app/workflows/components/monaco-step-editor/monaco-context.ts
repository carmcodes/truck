import * as monaco from 'monaco-editor';

export type CompletionContextKind =
  | 'StartOfLine'
  | 'IfCondition'
  | 'WhileCondition'
  | 'General';

export interface CompletionContext {
  kind: CompletionContextKind;
}

/**
 * Detects completion context based on cursor position and grammar intent.
 */
export function detectContextFromGrammar(
  model: monaco.editor.ITextModel,
  position: monaco.Position
): CompletionContext {

  const line = model.getLineContent(position.lineNumber);

  // Monaco columns are 1-based
  const beforeCursor = line.slice(0, position.column - 1);

  // -----------------------------
  // 1️⃣ START OF LINE
  // Only whitespace before cursor
  // -----------------------------
  if (beforeCursor.trim() === '') {
    return { kind: 'StartOfLine' };
  }

  // -----------------------------
  // 2️⃣ Ignore completions inside strings
  // -----------------------------
  if (isInsideString(beforeCursor)) {
    return { kind: 'General' };
  }

  // Normalize whitespace for keyword checks
  const normalized = beforeCursor.trim().replace(/\s+/g, ' ');

  // -----------------------------
  // 3️⃣ IF CONDITION
  // if <expression> { ... }
  // Condition ends once '{' appears
  // -----------------------------
  if (
    normalized.startsWith('if ') &&
    isKeywordBoundary(normalized, 0, 'if') &&
    !normalized.includes('{')
  ) {
    return { kind: 'IfCondition' };
  }

  // -----------------------------
  // 4️⃣ WHILE CONDITION
  // while <expression> { ... }
  // -----------------------------
  if (
    normalized.startsWith('while ') &&
    isKeywordBoundary(normalized, 0, 'while') &&
    !normalized.includes('{')
  ) {
    return { kind: 'WhileCondition' };
  }

  // -----------------------------
  // 5️⃣ DEFAULT
  // -----------------------------
  return { kind: 'General' };
}

/**
 * Ensures keyword is not part of an identifier
 * e.g. "ifx" ≠ "if"
 */
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

/**
 * Lightweight string detection to avoid suggesting inside strings
 */
function isInsideString(prefix: string): boolean {
  let inDouble = false;
  let inSingle = false;

  for (let i = 0; i < prefix.length; i++) {
    const ch = prefix[i];
    const prev = i > 0 ? prefix[i - 1] : '';

    if (ch === '"' && prev !== '\\' && !inSingle) inDouble = !inDouble;
    if (ch === "'" && prev !== '\\' && !inDouble) inSingle = !inSingle;
  }

  return inDouble || inSingle;
}
