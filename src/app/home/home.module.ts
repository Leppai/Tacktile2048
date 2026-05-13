import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { PrivacyConsentComponent } from 'src/app/components/privacy-consent/privacy-consent.component';
import { WelcomeTutorialComponent } from 'src/app/components/welcome-tutorial/welcome-tutorial.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage,
    PrivacyConsentComponent,
    WelcomeTutorialComponent,
  ]
})
export class HomePageModule {}
