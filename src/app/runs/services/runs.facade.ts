import { Injectable, computed, inject, signal } from '@angular/core';
import { RunsApi, RunDto, RunStepDto } from './runs.api';

@Injectable({ providedIn: 'root' })
export class RunsFacade {
  private api = inject(RunsApi);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly run = signal<RunDto | null>(null);
  readonly steps = signal<RunStepDto[]>([]);
  readonly selectedStepId = signal<string | null>(null);

  readonly selectedStep = computed(() => {
    const id = this.selectedStepId();
    return this.steps().find(s => s.stepId === id) ?? null;
  });

  readonly logs = signal<string[]>([]);
  readonly outputs = signal<Record<string, unknown>>({});

  async load(runId: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const run = await this.api.getRun(runId).toPromise();
      const steps = await this.api.getSteps(runId).toPromise();

      this.run.set(run ?? null);
      this.steps.set(steps ?? []);
      this.selectedStepId.set((steps ?? [])[0]?.stepId ?? null);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to load run');
    } finally {
      this.loading.set(false);
    }
  }

  async selectStep(runId: string, stepId: string) {
    this.selectedStepId.set(stepId);
    this.logs.set([]);
    this.outputs.set({});

    try {
      const logs = await this.api.getStepLogs(runId, stepId).toPromise();
      const outputs = await this.api.getStepOutputs(runId, stepId).toPromise();
      this.logs.set(logs?.lines ?? []);
      this.outputs.set(outputs?.outputs ?? {});
    } catch {
      // don’t block UI; show partial
    }
  }
}
