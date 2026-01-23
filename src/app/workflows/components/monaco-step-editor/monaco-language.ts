import * as monaco from 'monaco-editor';

let registered = false;

export function registerWorkflowLanguage() {
  if (registered) {
return;
}
  registered = true;

  monaco.languages.register({id: 'workflowLang'});

  monaco.languages.setMonarchTokensProvider('workflowLang', {
    tokenizer: {
      root: [
        [/\b(if|else|forEach|switch|case|default|return|let|var|const)\b/, 'keyword'],
        [/[a-zA-Z_]\w*/, 'identifier'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, {token: 'string.quote', bracket: '@open', next: '@string'}],
        [/[{}()\[\]]/, '@brackets'],
        [/[0-9]+(\.[0-9]+)?/, 'number'],
        [/\/\/.*/, 'comment']
      ],
      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}]
      ]
    }
  });

  monaco.editor.defineTheme('workflowTheme', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {}
  });

  monaco.editor.setTheme('workflowTheme');
}
