import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRunPage } from './workflow-run-page';

describe('WorkflowRunPage', () => {
  let component: WorkflowRunPage;
  let fixture: ComponentFixture<WorkflowRunPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowRunPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowRunPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
