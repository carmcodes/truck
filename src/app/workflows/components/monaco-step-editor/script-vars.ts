/**
 * UI-only variable model for Monaco completion & diagnostics.
 * This is intentionally NOT imported from workflow-models,
 * because backend no longer exposes variable metadata.
 */

export type VarKind =
  | 'bool'
  | 'number'
  | 'string'
  | 'object'
  | 'array'
  | 'unknown';

export interface WorkflowVar {
  name: string;
  kind: VarKind;
}

// Matches:   myVar = <something>
const ASSIGN_RE = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)\s*$/;

export function extractVarsFromCode(code: string): WorkflowVar[] {
  const map = new Map<string, WorkflowVar>();
  const lines = code.split(/\r?\n/);

  for (const line of lines) {
    const m = line.match(ASSIGN_RE);
    if (!m) continue;

    const name = m[1];
    const rhs = m[2];

    const kind = inferKindFromRhs(rhs);
    map.set(name, { name, kind });
  }

  return [...map.values()];
}

function inferKindFromRhs(rhs: string): VarKind {
  const t = rhs.trim();

  if (t === 'true' || t === 'false') return 'bool';
  if (t === 'null') return 'unknown';

  // number
  if (/^[+-]?\d+(\.\d+)?$/.test(t)) return 'number';

  // string literal
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return 'string';
  }

  // array literal heuristic
  if (t.startsWith('[') && t.endsWith(']')) return 'array';

  // object literal heuristic
  if (t.startsWith('{') && t.endsWith('}')) return 'object';

  return 'unknown';
}
