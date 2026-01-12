import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonacoStepEditor } from './monaco-step-editor';

describe('MonacoStepEditor', () => {
  let component: MonacoStepEditor;
  let fixture: ComponentFixture<MonacoStepEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonacoStepEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonacoStepEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
