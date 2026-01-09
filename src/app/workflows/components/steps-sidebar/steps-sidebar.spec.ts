import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsSidebar } from './steps-sidebar';

describe('StepsSidebar', () => {
  let component: StepsSidebar;
  let fixture: ComponentFixture<StepsSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepsSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepsSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
