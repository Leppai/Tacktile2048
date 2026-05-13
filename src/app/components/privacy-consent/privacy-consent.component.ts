import { Component, EventEmitter, Output } from '@angular/core';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-privacy-consent',
  templateUrl: './privacy-consent.component.html',
  styleUrls: ['./privacy-consent.component.scss'],
  standalone:false,
})
export class PrivacyConsentComponent {

  @Output() accept = new EventEmitter<void>();


  constructor() {}


  async openPolicy() {
    await Browser.open({
      url: 'https://leppai.github.io/privacy2048/',
    });
  }

}