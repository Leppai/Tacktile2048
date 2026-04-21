import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { GameOverComponent } from './game-over/game-over.component';

@NgModule({
  declarations: [
    HowToPlayComponent,
    GameOverComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HowToPlayComponent,
    GameOverComponent
  ]
})
export class ComponentsModule {}