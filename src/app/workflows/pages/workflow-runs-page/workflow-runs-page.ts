import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {WorkflowApi} from '../../services/workflows.api';

@Component({
  standalone: true,
  selector: 'app-workflow-runs-page',
  imports: [CommonModule],
  templateUrl: './workflow-runs-page.html',
})
export class WorkflowRunsPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(WorkflowApi);

  workflowId = '';
  loading = false;
  error: string | null = null;
  runs: any[] = [];

  async ngOnInit() {
    this.workflowId = this.route.snapshot.paramMap.get('id')!;
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;
    try {
      // this.runs = await this.api.listRuns(this.workflowId).toPromise() ?? [];
    } catch (e: any) {
      this.error = e?.message ?? 'Failed to load runs';
    } finally {
      this.loading = false;
    }
  }

  open(runId: string) {
    this.router.navigate(['/runs', runId]);
  }
}
