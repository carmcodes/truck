import { Component, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {WorkflowsFacade} from '../../services/workflows.facade';
import {WorkflowApi} from '../../services/workflows.api';
@Component({
  standalone: true,
  selector: 'app-workflow-run-page',
  imports: [],
  templateUrl: './workflow-run-page.html',
})
export class WorkflowRunPage {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private api = inject(WorkflowApi);
  readonly facade = inject(WorkflowsFacade);

  workflowId = '';
  running = signal(false);
  error = signal<string | null>(null);

  // super-min runtime inputs (key/value). Replace with your real input UI.
  runtimeJson = signal<string>('{}');

  async ngOnInit() {
    this.workflowId = this.route.snapshot.paramMap.get('id')!;
    // await this.facade.loadWorkflow(this.workflowId);
  }

  async start() {
    this.running.set(true);
    this.error.set(null);

    try {
    //   const inputs = JSON.parse(this.runtimeJson());
    //   const run = await this.api.startRun(this.workflowId, { inputs }).toPromise();
    //   const runId = run?.id;
    //   if (!runId) throw new Error('Run ID missing from backend response');
    //   this.router.navigate(['/runs', runId]);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to start run');
    } finally {
      this.running.set(false);
    }
  }
}
