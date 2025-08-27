import {Component, OnInit, signal} from '@angular/core';
import {QrComponent} from './qr-component/qr-component';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  imports: [QrComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  constructor(private translocoService: TranslocoService) {
  }

  ngOnInit() {
    document.documentElement.lang = this.translocoService.getActiveLang();
    this.translocoService.langChanges$.subscribe(lang => {
      document.documentElement.lang = lang;
    });
  }

  protected readonly title = signal('wifi-qr');
}
