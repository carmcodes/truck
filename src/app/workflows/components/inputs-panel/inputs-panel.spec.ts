import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsPanel } from './inputs-panel';

describe('InputsPanel', () => {
  let component: InputsPanel;
  let fixture: ComponentFixture<InputsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputsPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
