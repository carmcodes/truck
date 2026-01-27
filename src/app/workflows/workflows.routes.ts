import {Routes} from '@angular/router';
import {WorkflowListPage} from './pages/workflow-list-page/workflow-list-page';
import {WorkflowDesignerPage} from './pages/workflow-designer-page/workflow-designer-page';
import {WorkflowRunPage} from './pages/workflow-run-page/workflow-run-page';
import {WorkflowRunsPage} from './pages/workflow-runs-page/workflow-runs-page';


export const WORKFLOWS_ROUTES: Routes = [
  {
    path: '',
    component: WorkflowListPage
  },

  {
    path: 'new',
    component: WorkflowDesignerPage
  },

  {
    path: ':id/designer',
    component: WorkflowDesignerPage
  },

  {
    path: ':id/run',
    component: WorkflowRunPage
  },

  {
    path: ':id/runs',
    component: WorkflowRunsPage
  },
];
