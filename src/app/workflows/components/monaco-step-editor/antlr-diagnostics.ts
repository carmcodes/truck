import * as monaco from 'monaco-editor';

type TokType =
  | 'IDENT' | 'INT' | 'FLOAT' | 'STRING' | 'BOOL' | 'NULL'
  | 'IF' | 'ELSE' | 'WHILE'
  | 'LPAREN' | 'RPAREN' | 'LBRACE' | 'RBRACE' | 'LBRACKET' | 'RBRACKET'
  | 'COMMA'
  | 'EQ' | 'EQEQ' | 'NEQ' | 'GT' | 'LT' | 'GTE' | 'LTE'
  | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH'
  | 'NOT'
  | 'AND' | 'OR'
  | 'NEWLINE'
  | 'EOF';

type Tok = {
  t: TokType;
  text: string;
  start: number;
  end: number;
  line: number;
  col: number;
};

function isAlpha(ch: string) {
  return /^[a-zA-Z_]$/.test(ch);
}
function isAlnum(ch: string) {
  return /^[a-zA-Z0-9_.]$/.test(ch); // ✅ Allow dots for namespaced identifiers like Inputs.step1.var
}
function isDigit(ch: string) {
  return /^[0-9]$/.test(ch);
}

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0, line = 1, col = 1;

  const push = (t: TokType, text: string, start: number, end: number, l: number, c: number) =>
    toks.push({t, text, start, end, line: l, col: c});

  const adv = (n = 1) => {
    for (let k = 0; k < n; k++) {
      const ch = src[i++];
      if (ch === '\n') {
        line++; col = 1;
      } else {
        col++;
      }
    }
  };

  while (i < src.length) {
    const ch = src[i];

    // Skip whitespace except newlines
    if (ch === ' ' || ch === '\t') {
      adv(); continue;
    }

    // Handle newlines (both \n and \r\n)
    if (ch === '\r') {
      const l = line, c = col, start = i;
      if (src[i + 1] === '\n') {
        adv(2);
      } else {
        adv(1);
      }
      push('NEWLINE', '\\n', start, i, l, c);
      continue;
    }
    if (ch === '\n') {
      const l = line, c = col, start = i;
      adv(1);
      push('NEWLINE', '\\n', start, i, l, c);
      continue;
    }

    const l = line, c = col, start = i;

    // Single-character tokens
    if (ch === '(') { adv(); push('LPAREN', ch, start, i, l, c); continue; }
    if (ch === ')') { adv(); push('RPAREN', ch, start, i, l, c); continue; }
    if (ch === '{') { adv(); push('LBRACE', ch, start, i, l, c); continue; }
    if (ch === '}') { adv(); push('RBRACE', ch, start, i, l, c); continue; }
    if (ch === '[') { adv(); push('LBRACKET', ch, start, i, l, c); continue; } // ✅ Added
    if (ch === ']') { adv(); push('RBRACKET', ch, start, i, l, c); continue; } // ✅ Added
    if (ch === ',') { adv(); push('COMMA', ch, start, i, l, c); continue; }
    if (ch === '+') { adv(); push('PLUS', ch, start, i, l, c); continue; }
    if (ch === '-') { adv(); push('MINUS', ch, start, i, l, c); continue; }
    if (ch === '*') { adv(); push('STAR', ch, start, i, l, c); continue; }
    if (ch === '/') {
      // Check for comments
      if (src[i + 1] === '/') {
        // Single-line comment - skip until newline
        while (i < src.length && src[i] !== '\n' && src[i] !== '\r') {
          adv();
        }
        continue;
      }
      adv(); push('SLASH', ch, start, i, l, c); continue;
    }

    // Multi-character operators
    if (ch === '!') {
      if (src[i + 1] === '=') {
        adv(2); push('NEQ', '!=', start, i, l, c);
      } else {
        adv(1); push('NOT', '!', start, i, l, c);
      }
      continue;
    }
    if (ch === '=') {
      if (src[i + 1] === '=') {
        adv(2); push('EQEQ', '==', start, i, l, c);
      } else {
        adv(1); push('EQ', '=', start, i, l, c);
      }
      continue;
    }
    if (ch === '>') {
      if (src[i + 1] === '=') {
        adv(2); push('GTE', '>=', start, i, l, c);
      } else {
        adv(1); push('GT', '>', start, i, l, c);
      }
      continue;
    }
    if (ch === '<') {
      if (src[i + 1] === '=') {
        adv(2); push('LTE', '<=', start, i, l, c);
      } else {
        adv(1); push('LT', '<', start, i, l, c);
      }
      continue;
    }

    // Numbers (INT and FLOAT)
    if (isDigit(ch)) {
      let j = i;
      while (j < src.length && isDigit(src[j])) {
        j++;
      }
      if (src[j] === '.' && isDigit(src[j + 1] ?? '')) {
        j++;
        while (j < src.length && isDigit(src[j])) {
          j++;
        }
        const text = src.slice(i, j);
        const tokStart = i, tokLine = line, tokCol = col;
        adv(j - i);
        push('FLOAT', text, tokStart, i, tokLine, tokCol);
      } else {
        const text = src.slice(i, j);
        const tokStart = i, tokLine = line, tokCol = col;
        adv(j - i);
        push('INT', text, tokStart, i, tokLine, tokCol);
      }
      continue;
    }

    // Strings
    if (ch === '"' || ch === '\'') {
      const quote = ch;
      const tokStart = i, tokLine = line, tokCol = col;
      adv(1);
      while (i < src.length && src[i] !== quote && src[i] !== '\n' && src[i] !== '\r') {
        if (src[i] === '\\' && i + 1 < src.length) {
          adv(2); // Skip escape sequence
        } else {
          adv(1);
        }
      }
      if (i < src.length && src[i] === quote) {
        adv(1);
        push('STRING', src.slice(tokStart, i), tokStart, i, tokLine, tokCol);
      } else {
        // Unclosed string
        push('STRING', src.slice(tokStart, i), tokStart, i, tokLine, tokCol);
      }
      continue;
    }

    // Identifiers and keywords
    if (isAlpha(ch)) {
      let j = i + 1;
      while (j < src.length && isAlnum(src[j])) {
        j++;
      }
      const text = src.slice(i, j);
      const tokStart = i, tokLine = line, tokCol = col;
      adv(j - i);

      const kw = text;
      if (kw === 'if') {
        push('IF', text, tokStart, i, tokLine, tokCol);
      } else if (kw === 'else') {
        push('ELSE', text, tokStart, i, tokLine, tokCol);
      } else if (kw === 'while') {
        push('WHILE', text, tokStart, i, tokLine, tokCol);
      } else if (kw === 'true' || kw === 'false') {
        push('BOOL', text, tokStart, i, tokLine, tokCol);
      } else if (kw === 'null') {
        push('NULL', text, tokStart, i, tokLine, tokCol);
      } else if (kw === 'and') {
        push('AND', text, tokStart, i, tokLine, tokCol);
      } else if (kw === 'or') {
        push('OR', text, tokStart, i, tokLine, tokCol);
      } else {
        push('IDENT', text, tokStart, i, tokLine, tokCol);
      }
      continue;
    }

    // Unknown character - skip it
    adv(1);
  }

  toks.push({t: 'EOF', text: '', start: src.length, end: src.length, line, col});
  return toks;
}

class Parser {
  private i = 0;
  public errors: { message: string; tok: Tok }[] = [];
  constructor(private toks: Tok[]) {}

  private cur(): Tok {
    return this.toks[this.i];
  }
  private at(t: TokType) {
    return this.cur().t === t;
  }
  private eat(t: TokType, msg: string) {
    if (this.at(t)) {
      this.i++; return;
    }
    this.err(msg);
  }
  private err(message: string) {
    this.errors.push({message, tok: this.cur()});
    if (!this.at('EOF')) {
      this.i++;
    }
  }

  parseProgram() {
    while (!this.at('EOF')) {
      if (this.at('NEWLINE')) {
        this.i++; continue;
      }
      this.parseLine();
    }
  }

  parseLine() {
    if (this.at('IF')) {
      return this.parseIf();
    }
    if (this.at('WHILE')) {
      return this.parseWhile();
    }
    return this.parseStatement();
  }

  parseStatement() {
    if (!this.at('IDENT')) {
      this.err('Expected statement (assignment or function call)');
      this.syncToLineEnd();
      return;
    }

    const ident = this.cur();
    this.i++;

    // ✅ Handle array assignment: arr[index] = value
    if (this.at('LBRACKET')) {
      this.i++;
      this.parseExpression();
      this.eat('RBRACKET', "Expected ']'");
      this.eat('EQ', "Expected '=' for array assignment");
      this.parseExpression();
      this.requireNewline('Expected newline after array assignment');
      return;
    }

    // Regular assignment: var = value
    if (this.at('EQ')) {
      this.i++;
      this.parseExpression();
      this.requireNewline('Expected newline after assignment');
      return;
    }

    // Function call: func(args)
    if (this.at('LPAREN')) {
      this.i++;
      if (!this.at('RPAREN')) {
        this.parseExpression();
        while (this.at('COMMA')) {
          this.i++;
          this.parseExpression();
        }
      }
      this.eat('RPAREN', "Expected ')' to close function call");
      this.requireNewline('Expected newline after function call');
      return;
    }

    this.errors.push({message: "Expected '=', '[', or '(' after identifier", tok: ident});
    this.syncToLineEnd();
  }

  parseIf() {
    this.eat('IF', "Expected 'if'");
    this.eat('LPAREN', "Expected '(' after 'if'"); // ✅ Grammar requires parentheses
    this.parseExpression();
    this.eat('RPAREN', "Expected ')' after if condition"); // ✅ Grammar requires closing paren
    this.parseBlock();
    if (this.at('ELSE')) {
      this.i++;
      if (this.at('IF')) {
        this.parseIf();
      } else {
        this.parseBlock();
      }
    }
  }

  parseWhile() {
    this.eat('WHILE', "Expected 'while'");
    this.eat('LPAREN', "Expected '(' after 'while'"); // ✅ Grammar requires parentheses
    this.parseExpression();
    this.eat('RPAREN', "Expected ')' after while condition"); // ✅ Grammar requires closing paren
    this.parseBlock();
  }

  parseBlock() {
    this.eat('LBRACE', "Expected '{' to start block");
    while (!this.at('RBRACE') && !this.at('EOF')) {
      if (this.at('NEWLINE')) {
        this.i++; continue;
      }
      this.parseLine();
    }
    this.eat('RBRACE', "Expected '}' to close block");
  }

  parseExpression() {
    this.parseOr();
  }

  private parseOr() {
    this.parseAnd();
    while (this.at('OR')) {
      this.i++;
      this.parseAnd();
    }
  }

  private parseAnd() {
    this.parseCompare();
    while (this.at('AND')) {
      this.i++;
      this.parseCompare();
    }
  }

  private parseCompare() {
    this.parseAdd();
    while (this.at('EQEQ') || this.at('NEQ') || this.at('GT') || this.at('LT') || this.at('GTE') || this.at('LTE')) {
      this.i++;
      this.parseAdd();
    }
  }

  private parseAdd() {
    this.parseMul();
    while (this.at('PLUS') || this.at('MINUS')) {
      this.i++;
      this.parseMul();
    }
  }

  private parseMul() {
    this.parseUnary();
    while (this.at('STAR') || this.at('SLASH')) {
      this.i++;
      this.parseUnary();
    }
  }

  private parseUnary() {
    if (this.at('NOT')) {
      this.i++;
      this.parseUnary();
      return;
    }
    this.parsePrimary();
  }

  private parsePrimary() {
    // Constants
    if (this.at('INT') || this.at('FLOAT') || this.at('STRING') || this.at('BOOL') || this.at('NULL')) {
      this.i++;
      return;
    }

    // Array literals: [expr, expr, ...]
    if (this.at('LBRACKET')) {
      this.i++;
      if (!this.at('RBRACKET')) {
        this.parseExpression();
        while (this.at('COMMA')) {
          this.i++;
          this.parseExpression();
        }
      }
      this.eat('RBRACKET', "Expected ']' to close array");
      return;
    }

    // Identifiers (variables, array access, function calls)
    if (this.at('IDENT')) {
      this.i++;

      // Array access: arr[index]
      if (this.at('LBRACKET')) {
        this.i++;
        this.parseExpression();
        this.eat('RBRACKET', "Expected ']' for array access");
        return;
      }

      // Function call: func(args)
      if (this.at('LPAREN')) {
        this.i++;
        if (!this.at('RPAREN')) {
          this.parseExpression();
          while (this.at('COMMA')) {
            this.i++;
            this.parseExpression();
          }
        }
        this.eat('RPAREN', "Expected ')' to close function call");
      }
      return;
    }

    // Parenthesized expression: (expr)
    if (this.at('LPAREN')) {
      this.i++;
      this.parseExpression();
      this.eat('RPAREN', "Expected ')' after expression");
      return;
    }

    // Error cases
    if (this.at('EOF') || this.at('NEWLINE') || this.at('RBRACE')) {
      this.err('Expected expression');
      return;
    }

    this.err('Unexpected token in expression');
  }

  private requireNewline(msg: string) {
    if (this.at('EOF')) {
      return;
    }
    if (this.at('NEWLINE')) {
      this.i++; return;
    }
    this.err(msg);
    this.syncToLineEnd();
  }

  private syncToLineEnd() {
    while (!this.at('NEWLINE') && !this.at('RBRACE') && !this.at('EOF')) {
      this.i++;
    }
    if (this.at('NEWLINE')) {
      this.i++;
    }
  }
}

function toMarker(e: { message: string; tok: Tok }): monaco.editor.IMarkerData {
  const t = e.tok;
  return {
    severity: monaco.MarkerSeverity.Error,
    message: e.message,
    startLineNumber: t.line,
    startColumn: t.col,
    endLineNumber: t.line,
    endColumn: Math.max(t.col + 1, t.col + (t.end - t.start)),
    source: 'syntax'
  };
}

export function applyAntlrDiagnostics(model: monaco.editor.ITextModel): monaco.editor.IMarkerData[] {
  const src = model.getValue();
  const toks = tokenize(src);
  const p = new Parser(toks);
  p.parseProgram();

  return p.errors.map(toMarker);
}
