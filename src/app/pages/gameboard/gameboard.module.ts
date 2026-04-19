import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameboardPageRoutingModule } from './gameboard-routing.module';

import { GameboardPage } from './gameboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameboardPageRoutingModule
  ],
  declarations: [GameboardPage]
})
export class GameboardPageModule {}
