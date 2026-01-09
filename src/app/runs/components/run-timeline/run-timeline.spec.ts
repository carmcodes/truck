import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunTimeline } from './run-timeline';

describe('RunTimeline', () => {
  let component: RunTimeline;
  let fixture: ComponentFixture<RunTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
