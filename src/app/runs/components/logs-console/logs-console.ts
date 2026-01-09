import { Component, Input } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-logs-console',
  imports: [],
  template: `
  <div style="border:1px solid #ddd; border-radius:10px; padding:10px; height:100%; overflow:auto;">
    <div style="font-weight:700; margin-bottom:8px;">Logs</div>
    <pre style="margin:0; font-size:12px; white-space:pre-wrap;">{{ (lines || []).join('\\n') }}</pre>
  </div>
  `,
})
export class LogsConsoleComponent {
  @Input() lines: string[] = [];
}
