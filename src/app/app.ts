import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MonacoStepEditorComponent} from './workflows/components/monaco-step-editor/monaco-step-editor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MonacoStepEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('monaco');
}
