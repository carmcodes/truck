import type { VarKind, WorkflowVar } from "./workflow-vars";

/**
 * Grammar says:
 * statement: (assignment | functionCall) NEWLINE;
 * assignment: IDENTIFIER '=' expression;
 *
 * So a "created variable" is the LHS IDENTIFIER of an assignment.
 *
 * We accept both \n and \r\n in the editor, even if grammar uses NEWLINE:'\r\n'.
 */
const IDENT = `[a-zA-Z_][a-zA-Z0-9_]*`;
const ASSIGNMENT_RE = new RegExp(`^\\s*(${IDENT})\\s*=\\s*(.+?)\\s*$`);

export function extractVarsFromCode(code: string): WorkflowVar[] {
  const map = new Map<string, WorkflowVar>();

  // Monaco will usually use \n internally; be tolerant
  const lines = code.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // ignore block braces alone
    if (line === "{" || line === "}") continue;

    // ignore control headers (if/while); vars are inside assignment lines
    if (line.startsWith("if ") || line.startsWith("while ")) continue;

    const m = line.match(ASSIGNMENT_RE);
    if (!m) continue;

    const name = m[1];
    const rhs = m[2];

    map.set(name, { name, kind: inferKindFromExpression(rhs), source: "step" });
  }

  return [...map.values()];
}

/**
 * Infer type from constant rules in grammar:
 * constant: INTEGER | FLOAT | STRING | BOOL | NULL;
 */
function inferKindFromExpression(expr: string): VarKind {
  const t = expr.trim();

  if (t === "true" || t === "false") return "bool";
  if (t === "null") return "unknown";

  if (/^[0-9]+$/.test(t)) return "number";
  if (/^[0-9]+\.[0-9]+$/.test(t)) return "number";

  // STRING: "..." or '...'
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return "string";
  }

  // We don’t have array/object literals in grammar, so default unknown.
  // (If you later add JSON/object literals, update this.)
  return "unknown";
}
