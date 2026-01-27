import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  Id,
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
  GetWorkflowsResponse, ExportTypeDto
} from '../models/workflow-models';
import {environment} from '../../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class WorkflowApi {
  private http = inject(HttpClient);

  private readonly baseUrl = environment.mainApiUrl;

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

  getExportTypes(): Observable<ExportTypeDto[]> {
    return this.http.get<ExportTypeDto[]>(`${this.baseUrl}/Workflow/export/types`);
  }

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

  uploadStepInput(stepId: Id, file: File): Observable<UploadStepInputResponse> {
    const form = new FormData();
    form.append("stepId", String(stepId));
    form.append("file", file);

    return this.http.put<UploadStepInputResponse>(`${this.baseUrl}/Step/input`, form);
  }
}
