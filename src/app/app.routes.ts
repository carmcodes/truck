import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'workflows',
    pathMatch: 'full',
  },

  {
    path: 'workflows',
    loadChildren: () =>
      import('./workflows/workflows.routes')
        .then(m => m.WORKFLOWS_ROUTES),
  },

  {
    path: 'runs',
    loadChildren: () =>
      import('./runs/runs.routes')
        .then(m => m.RUNS_ROUTES),
  },

  {
    path: '**',
    redirectTo: 'workflows',
  },
];
