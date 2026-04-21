import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-consent',
  templateUrl: './privacy-consent.component.html',
  styleUrls: ['./privacy-consent.component.scss'],
  standalone:false,
})
export class PrivacyConsentComponent {

  @Output() accept = new EventEmitter<void>();


  constructor(private router: Router) {}


  openPolicy(){

    this.router.navigate(['/privacy-policy']);

  }

}