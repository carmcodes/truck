import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRunsPage } from './workflow-runs-page';

describe('WorkflowRunsPage', () => {
  let component: WorkflowRunsPage;
  let fixture: ComponentFixture<WorkflowRunsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowRunsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowRunsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
