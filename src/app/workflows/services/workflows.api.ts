import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {Id,
  WorkflowDto,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  RunWorkflowRequest,
  RunWorkflowResponse,
  DeleteLastStepResponse,
  GetStepsResponse,
  StepDto,
  CreateStepRequest,
  UpdateStepRequest,
  UploadStepScriptRequest,
  UploadStepScriptResponse,
  UploadStepInputResponse,
  GetWorkflowsResponse} from '../models/workflow-models';

@Injectable({ providedIn: "root" })
export class WorkflowApi {
  private readonly baseUrl = "/api";

  constructor(private http: HttpClient) {}

  /* =======================
     Workflow
     ======================= */

  getWorkflows(): Observable<GetWorkflowsResponse> {
    return this.http.get<GetWorkflowsResponse>(`${this.baseUrl}/Workflow`);
  }

  createWorkflow(payload: CreateWorkflowRequest): Observable<WorkflowDto> {
    return this.http.post<WorkflowDto>(`${this.baseUrl}/Workflow`, payload);
  }

  updateWorkflow(payload: UpdateWorkflowRequest): Observable<WorkflowDto> {
    return this.http.put<WorkflowDto>(`${this.baseUrl}/Workflow`, payload);
  }

  deleteLastStep(workflowId: Id): Observable<DeleteLastStepResponse> {
    return this.http.delete<DeleteLastStepResponse>(
      `${this.baseUrl}/Workflow/${workflowId}/Step`
    );
  }

  runWorkflow(payload: RunWorkflowRequest): Observable<RunWorkflowResponse> {
    return this.http.put<RunWorkflowResponse>(`${this.baseUrl}/Workflow/run`, payload);
  }

  /* =======================
     Step
     ======================= */

  getSteps(workflowId: Id): Observable<GetStepsResponse> {
    return this.http.get<GetStepsResponse>(`${this.baseUrl}/Step/${workflowId}`);
  }

  createStep(payload: CreateStepRequest): Observable<StepDto> {
    return this.http.post<StepDto>(`${this.baseUrl}/Step`, payload);
  }

  updateStep(payload: UpdateStepRequest): Observable<StepDto> {
    return this.http.put<StepDto>(`${this.baseUrl}/Step`, payload);
  }

  uploadStepScript(payload: UploadStepScriptRequest): Observable<UploadStepScriptResponse> {
    return this.http.put<UploadStepScriptResponse>(`${this.baseUrl}/Step/script`, payload);
  }

  /**
   * PUT /api/Step/input
   * multipart/form-data: stepId + file
   */
  uploadStepInput(stepId: Id, file: File): Observable<UploadStepInputResponse> {
    const form = new FormData();
    // common backend binding expects exact casing. If your backend uses "StepId", swap it.
    form.append("stepId", String(stepId));
    form.append("file", file);

    return this.http.put<UploadStepInputResponse>(`${this.baseUrl}/Step/input`, form);
  }
}
