import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepConfigPanel } from './step-config-panel';

describe('StepConfigPanel', () => {
  let component: StepConfigPanel;
  let fixture: ComponentFixture<StepConfigPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepConfigPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepConfigPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
