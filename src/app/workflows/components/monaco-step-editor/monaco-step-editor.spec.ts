import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MonacoStepEditorComponent} from './monaco-step-editor';


describe('MonacoStepEditor', () => {
  let component: MonacoStepEditorComponent;
  let fixture: ComponentFixture<MonacoStepEditorComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [MonacoStepEditorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonacoStepEditorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
