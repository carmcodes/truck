import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepRunDetails } from './step-run-details';

describe('StepRunDetails', () => {
  let component: StepRunDetails;
  let fixture: ComponentFixture<StepRunDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepRunDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepRunDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
