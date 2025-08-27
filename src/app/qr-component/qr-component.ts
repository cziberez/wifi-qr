import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import * as QRCode from 'qrcode';
import {TranslocoPipe, TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-qr-component',
  imports: [
    FormsModule,
    NgIf,
    TranslocoPipe
  ],
  templateUrl: './qr-component.html',
  styleUrl: './qr-component.scss',
})
export class QrComponent implements OnInit {
  ssid = '';
  password = '';
  qrCodeUrl: string | null = null;
  isDarkMode = false;
  private timer: any;

  constructor(private translocoService: TranslocoService) {
  }

  ngOnInit() {
    const browserLang = navigator.language
    const lang = browserLang.split('-')[0];
    const availableLangs = ['en', 'hu'];
    const defaultLang = availableLangs.includes(lang) ? lang : 'en';
    this.translocoService.setActiveLang(defaultLang);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark-theme');
      this.isDarkMode = true;
    } else {
      document.body.classList.add('light-theme');
      this.isDarkMode = false;
    }
  }

  onInputChange() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.generate();
    }, 100);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  async generate() {
    if (!this.ssid || !this.password) {
      this.qrCodeUrl = null;
      return;
    }

    const wifiString = `WIFI:T:WPA;S:${this.ssid};P:${this.password};;`;

    try {
      this.qrCodeUrl = await QRCode.toDataURL(wifiString, {
        type: 'image/png',
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300,
      });
    } catch (err) {
      console.error('QR generálási hiba:', err);
    }
  }

  printQr() {
    if (!this.qrCodeUrl) {
      return;
    }

    const width = Math.floor(window.innerWidth * 0.6);   // 60vw
    const height = Math.floor(window.innerHeight * 0.8); // 80vh
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    // Transloco-val lekért szövegek
    const wifiLabel = this.translocoService.translate('WIFI_ACCESS');
    const ssidLabel = this.translocoService.translate('SSID');
    const passwordLabel = this.translocoService.translate('PASSWORD');

    const printWindow = window.open('', '_blank',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>${wifiLabel}</title>
        <style>
          @page { margin: 0; size: auto; }
          body { font-family: Arial, sans-serif; text-align: center; padding: 40px; margin: 0; }
          .card {
            border: 2px solid #444;
            padding: 30px;
            border-radius: 15px;
            display: inline-block;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
          img { margin-top: 20px; }
          h2 { margin: 0; }
          p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>${wifiLabel}</h2>
          <p><b>${ssidLabel}:</b> ${this.ssid}</p>
          <p><b>${passwordLabel}:</b> ${this.password}</p>
          <img src="${this.qrCodeUrl}" />
        </div>
        <script>
          window.onload = () => window.print();
          window.onafterprint = () => window.close();
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  }
}
