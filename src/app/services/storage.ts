import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private GAME_KEY = 'gameData';
  private SETTINGS_KEY = 'settings';


  getGameData(){

    const data = localStorage.getItem(this.GAME_KEY);

    return data ? JSON.parse(data) : {

      gridSize:4,
      bestScore:0

    };

  }


  saveGameData(data:any){

    localStorage.setItem(
      this.GAME_KEY,
      JSON.stringify(data)
    );

  }


  getSettings(){

    const data = localStorage.getItem(this.SETTINGS_KEY);

    return data ? JSON.parse(data) : {

      sound:true

    };

  }


  saveSettings(settings:any){

    localStorage.setItem(
      this.SETTINGS_KEY,
      JSON.stringify(settings)
    );

  }


  resetGame(){

    localStorage.removeItem(this.GAME_KEY);

  }

}