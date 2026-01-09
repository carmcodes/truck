import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsConsole } from './logs-console';

describe('LogsConsole', () => {
  let component: LogsConsole;
  let fixture: ComponentFixture<LogsConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsConsole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsConsole);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
