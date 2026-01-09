import { Component, Input } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-variables-inspector',
  imports: [],
  template: `
  <div style="border:1px solid #ddd; border-radius:10px; padding:10px; height:100%; overflow:auto;">
    <div style="font-weight:700; margin-bottom:8px;">Outputs / Variables</div>
    <pre style="margin:0; font-size:12px; white-space:pre-wrap;">{{ pretty(data) }}</pre>
  </div>
  `,
})
export class VariablesInspectorComponent {
  @Input() data: Record<string, unknown> = {};

  pretty(v: unknown) {
    try { return JSON.stringify(v ?? {}, null, 2); } catch { return '{}'; }
  }
}
