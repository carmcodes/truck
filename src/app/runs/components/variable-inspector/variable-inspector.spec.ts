import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableInspector } from './variable-inspector';

describe('VariableInspector', () => {
  let component: VariableInspector;
  let fixture: ComponentFixture<VariableInspector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariableInspector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariableInspector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
