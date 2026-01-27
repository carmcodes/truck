import type {VarKind, WorkflowVar} from './workflow-vars';

const IDENT = '[a-zA-Z_][a-zA-Z0-9_]*';
const ASSIGNMENT_RE = new RegExp(`^\\s*(${IDENT})\\s*=\\s*(.+?)\\s*$`);

export function extractVarsFromCode(code: string): WorkflowVar[] {
  const map = new Map<string, WorkflowVar>();

  const lines = code.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line === '{' || line === '}') {
      continue;
    }

    if (line.startsWith('if ') || line.startsWith('while ')) {
      continue;
    }

    const m = line.match(ASSIGNMENT_RE);
    if (!m) {
      continue;
    }

    const name = m[1];
    const rhs = m[2];

    map.set(name, {name, kind: inferKindFromExpression(rhs), source: 'step'});
  }

  return [...map.values()];
}

function inferKindFromExpression(expr: string): VarKind {
  const t = expr.trim();

  if (t === 'true' || t === 'false') {
    return 'bool';
  }
  if (t === 'null') {
    return 'unknown';
  }

  if (/^[0-9]+$/.test(t)) {
    return 'number';
  }
  if (/^[0-9]+\.[0-9]+$/.test(t)) {
    return 'number';
  }

  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return 'string';
  }

  return 'unknown';
}
