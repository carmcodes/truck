import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";

import type { WorkflowListItemDto, Id } from "../../models/workflow-models";
import {WorkflowApi} from '../../services/workflows.api';

@Component({
  standalone: true,
  selector: "app-workflows-list-page",
  imports: [CommonModule, RouterLink],
  templateUrl: "./workflow-list-page.html",
})
export class WorkflowListPage {
  private api = inject(WorkflowApi);
  private router = inject(Router);

  loading = false;
  items: WorkflowListItemDto[] = [];
  error: string | null = null;

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;

    try {
      const res = await firstValueFrom(this.api.getWorkflows());
      this.items = res.workflows ?? [];
    } catch (e: any) {
      this.error = e?.message ?? "Failed to load workflows";
    } finally {
      this.loading = false;
    }
  }

  openDesigner(id: Id) {
    this.router.navigate(["/workflows", id, "designer"]);
  }

  async run(id: number) {
    try {
      await firstValueFrom(this.api.runWorkflow({ workflowId: id, extension: "json" }));
      this.router.navigate(["/workflows", id, "runs"]);
    } catch (e: any) {
      this.error = e?.message ?? "Failed to run workflow";
    }
  }

}
