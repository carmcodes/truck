import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunDetailsPage } from './run-details-page';

describe('RunDetailsPage', () => {
  let component: RunDetailsPage;
  let fixture: ComponentFixture<RunDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
