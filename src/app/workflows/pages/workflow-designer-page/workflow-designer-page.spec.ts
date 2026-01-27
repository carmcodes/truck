import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDesignerPage } from './workflow-designer-page';

describe('WorkflowDesignerPage', () => {
  let component: WorkflowDesignerPage;
  let fixture: ComponentFixture<WorkflowDesignerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowDesignerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowDesignerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
