import {Component, signal} from '@angular/core';
import {QrComponent} from './qr-component/qr-component';

@Component({
  selector: 'app-root',
  imports: [QrComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('wifi-qr');
}
