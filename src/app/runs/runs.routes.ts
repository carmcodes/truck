import { Routes } from '@angular/router';
import {RunDetailsPage} from './pages/run-details-page/run-details-page';


export const RUNS_ROUTES: Routes = [
  {
    path: ':runId',
    component: RunDetailsPage,
  },
];
