import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowListPage } from './workflow-list-page';

describe('WorkflowListPage', () => {
  let component: WorkflowListPage;
  let fixture: ComponentFixture<WorkflowListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
