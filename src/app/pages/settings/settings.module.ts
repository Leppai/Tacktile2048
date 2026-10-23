import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { HowToPlayComponent } from 'src/app/components/how-to-play/how-to-play.component';
import { ThemePickerComponent } from 'src/app/components/theme-picker/theme-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
  ],
  declarations: [
    SettingsPage,
    HowToPlayComponent,
    ThemePickerComponent,
  ]
})
export class SettingsPageModule {}
