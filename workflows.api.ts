import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  Id,
  GetWorkflowsResponse,
  WorkflowDto,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  GetStepsResponse,
  StepDto,
  CreateStepRequest,
  UpdateStepRequest,
  UploadStepScriptRequest,
  UploadStepScriptResponse,
} from "./workflow-models";

@Injectable({
  providedIn: "root",
})
export class WorkflowApi {
  private readonly baseUrl = "/api";

  constructor(private http: HttpClient) {}

  /* =======================
     Workflow
     ======================= */

  getWorkflows(): Observable<GetWorkflowsResponse> {
    return this.http.get<GetWorkflowsResponse>(
      `${this.baseUrl}/Workflow`
    );
  }

  createWorkflow(
    payload: CreateWorkflowRequest
  ): Observable<WorkflowDto> {
    return this.http.post<WorkflowDto>(
      `${this.baseUrl}/Workflow`,
      payload
    );
  }

  updateWorkflow(
    payload: UpdateWorkflowRequest
  ): Observable<WorkflowDto> {
    return this.http.put<WorkflowDto>(
      `${this.baseUrl}/Workflow`,
      payload
    );
  }

  /* =======================
     Step
     ======================= */

  getSteps(workflowId: Id): Observable<GetStepsResponse> {
    return this.http.get<GetStepsResponse>(
      `${this.baseUrl}/Step/${workflowId}`
    );
  }

  createStep(
    payload: CreateStepRequest
  ): Observable<StepDto> {
    return this.http.post<StepDto>(
      `${this.baseUrl}/Step`,
      payload
    );
  }

  updateStep(
    payload: UpdateStepRequest
  ): Observable<StepDto> {
    return this.http.put<StepDto>(
      `${this.baseUrl}/Step`,
      payload
    );
  }

  uploadStepScript(
    payload: UploadStepScriptRequest
  ): Observable<UploadStepScriptResponse> {
    return this.http.put<UploadStepScriptResponse>(
      `${this.baseUrl}/Step/script`,
      payload
    );
  }
}
