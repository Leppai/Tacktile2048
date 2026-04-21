import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameboardPageRoutingModule } from './gameboard-routing.module';

import { GameboardPage } from './gameboard.page';
import { GameOverComponent } from 'src/app/components/game-over/game-over.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameboardPageRoutingModule,
  ],
  declarations: [
    GameboardPage,
    GameOverComponent
  ]
})
export class GameboardPageModule {}
