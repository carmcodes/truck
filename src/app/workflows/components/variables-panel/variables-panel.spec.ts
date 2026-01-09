import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesPanel } from './variables-panel';

describe('VariablesPanel', () => {
  let component: VariablesPanel;
  let fixture: ComponentFixture<VariablesPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariablesPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariablesPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
