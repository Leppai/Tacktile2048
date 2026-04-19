import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameboardPage } from './gameboard.page';

const routes: Routes = [
  {
    path: '',
    component: GameboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameboardPageRoutingModule {}
