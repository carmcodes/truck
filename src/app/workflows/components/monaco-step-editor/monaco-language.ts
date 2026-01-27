import * as monaco from 'monaco-editor';

let registered = false;

export function registerWorkflowLanguage() {
  if (registered) {
    return;
  }
  registered = true;

  monaco.languages.register({id: 'workflowLang'});

  monaco.languages.setMonarchTokensProvider('workflowLang', {
    keywords: ['if', 'else', 'while', 'true', 'false', 'null', 'and', 'or'],
    operators: ['=', '==', '!=', '>', '<', '>=', '<=', '+', '-', '*', '/', '!'],

    tokenizer: {
      root: [
        // Keywords
        [/\b(if|else|while|and|or)\b/, 'keyword'],
        [/\b(true|false|null)\b/, 'keyword.constant'],

        // Built-in functions (you can add more from your LanguageVisitor)
        [/\b(Func\.(Write|Log|Pow|Pow2|Sqrt|Abs|CalculateDistance)|Arrays\.Add|Math\.(PI|E))\b/, 'function.builtin'],

        // Identifiers (including namespaced like Inputs.step1.var)
        [/[a-zA-Z_][a-zA-Z0-9_.]*/, 'identifier'],

        // Numbers
        [/\d+\.\d+/, 'number.float'],
        [/\d+/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, {token: 'string.quote', bracket: '@open', next: '@string_double'}],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/'/, {token: 'string.quote', bracket: '@open', next: '@string_single'}],

        // Brackets
        [/[{}()\[\]]/, '@brackets'],

        // Operators
        [/[=!<>]=?/, 'operator'],
        [/[+\-*/]/, 'operator'],

        // Comments
        [/\/\/.*$/, 'comment'],

        // Whitespace
        [/[ \t\r\n]+/, 'white']
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}]
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, {token: 'string.quote', bracket: '@close', next: '@pop'}]
      ]
    }
  });

  monaco.editor.defineTheme('workflowTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'keyword.constant', foreground: '0000FF' },
      { token: 'function.builtin', foreground: '795E26' },
      { token: 'identifier', foreground: '001080' },
      { token: 'number', foreground: '098658' },
      { token: 'number.float', foreground: '098658' },
      { token: 'string', foreground: 'A31515' },
      { token: 'string.invalid', foreground: 'FF0000' },
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      { token: 'operator', foreground: '000000' }
    ],
    colors: {}
  });

  monaco.editor.setTheme('workflowTheme');
}