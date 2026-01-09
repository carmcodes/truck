
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RunTimelineComponent } from '../../components/run-timeline/run-timeline';
import { LogsConsoleComponent } from '../../components/logs-console/logs-console';
import { StepRunDetails } from '../../components/step-run-details/step-run-details';
import { VariablesInspectorComponent } from '../../components/variable-inspector/variable-inspector';
import { RunsFacade } from '../../services/runs.facade';

@Component({
  standalone: true,
  selector: 'app-run-details-page',
  imports: [
    RunTimelineComponent,
    LogsConsoleComponent,
    StepRunDetails,
    VariablesInspectorComponent
  ],
  templateUrl: './run-details-page.html',
})
export class RunDetailsPage {
  private route = inject(ActivatedRoute);
  readonly facade = inject(RunsFacade);

  runId = '';

  async ngOnInit() {
    this.runId = this.route.snapshot.paramMap.get('runId')!;
    await this.facade.load(this.runId);

    const first = this.facade.steps()[0]?.stepId;
    if (first) await this.facade.selectStep(this.runId, first);
  }

  async onSelectStep(stepId: string) {
    await this.facade.selectStep(this.runId, stepId);
  }
}
