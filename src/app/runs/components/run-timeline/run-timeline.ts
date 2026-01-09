import { Component, EventEmitter, Input, Output } from '@angular/core';

import {RunStepDto} from '../../services/runs.api';

@Component({
  standalone: true,
  selector: 'app-run-timeline',
  imports: [],
  template: `
  <div style="border:1px solid #ddd; border-radius:10px; padding:10px; height:100%; overflow:auto;">
    <div style="font-weight:700; margin-bottom:10px;">Steps</div>
  
    @for (s of steps; track s) {
      <div
        (click)="selectStep.emit(s.stepId)"
        [style.background]="s.stepId === selectedStepId ? '#f2f2f2' : 'transparent'"
        style="padding:10px; border-radius:10px; cursor:pointer; margin-bottom:6px; border:1px solid #eee;"
        >
        <div style="display:flex; justify-content:space-between; gap:8px; align-items:center;">
          <div style="font-weight:600">{{ s.name }}</div>
          <span style="font-size:12px; opacity:.8">{{ s.status }}</span>
        </div>
        <div style="font-size:12px; opacity:.7; margin-top:4px;">
          {{ s.durationMs ? (s.durationMs + ' ms') : '' }}
          @if (s.cached) {
            <span> • cached</span>
          }
          @if (s.errorMessage) {
            <span style="color:#b00;"> • error</span>
          }
        </div>
      </div>
    }
  </div>
  `,
})
export class RunTimelineComponent {
  @Input({ required: true }) steps: RunStepDto[] = [];
  @Input() selectedStepId: string | null = null;
  @Output() selectStep = new EventEmitter<string>();
}
