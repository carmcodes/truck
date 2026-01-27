import * as monaco from 'monaco-editor';
import {detectContextFromGrammar} from './monaco-context';
import type {WorkflowVar} from './workflow-vars';


let completionDisposable: monaco.IDisposable | null = null;


export function registerWorkflowCompletion(getVariables: () => WorkflowVar[]) {
  completionDisposable?.dispose();

  completionDisposable = monaco.languages.registerCompletionItemProvider('workflowLang', {
    triggerCharacters: [' ', '(', '!', '=', '<', '>', ','],

    provideCompletionItems: (model, position) => {
      const ctx = detectContextFromGrammar(model, position);
      const vars = getVariables() ?? [];

      const word = model.getWordUntilPosition(position);
      const range = new monaco.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn
      );

      const suggestions: monaco.languages.CompletionItem[] = [];

      const keyword = (label: string, insertText?: string) =>
        suggestions.push({
          label,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: insertText ?? label,
          range
        });

      const variable = (v: WorkflowVar) =>
        suggestions.push({
          label: v.name,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: v.name,
          detail: `variable (${v.kind})`,
          range
        });

      // ✅ START OF LINE → vars + if + while
      if (ctx.kind === 'StartOfLine') {
        for (const v of vars) {
variable(v);
}
        keyword('if', 'if ');
        keyword('while', 'while ');
        return {suggestions};
      }

      // ✅ IF / WHILE condition → boolean vars only
      if (ctx.kind === 'IfCondition' || ctx.kind === 'WhileCondition') {
        // In your grammar, `expression` is general, not only boolean vars.
        // Suggest all known vars + operators/constants helpful in conditions.
        for (const v of vars) {
variable(v);
}

        // constants
        keyword('true');
        keyword('false');
        keyword('null');

        // boolean ops
        keyword('!', '!');
        keyword('and', 'and ');
        keyword('or', 'or ');

        // comparison ops (very common in conditions)
        keyword('==', '== ');
        keyword('!=', '!= ');
        keyword('>=', '>= ');
        keyword('<=', '<= ');
        keyword('>', '> ');
        keyword('<', '< ');

        // parentheses helpers
        keyword('(', '(');
        keyword(')', ')');

        return {suggestions};
      }


      // default
      for (const v of vars) {
variable(v);
}
      return {suggestions};
    }
  });
}
