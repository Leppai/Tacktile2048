import { Injectable } from '@angular/core';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private sounds:any = {};

  constructor(
    private storage:StorageService
  ){

    this.loadSounds();

  }


  loadSounds(){

    this.sounds.move =
      new Audio('assets/sounds/move.mp3');

    this.sounds.gameover =
      new Audio('assets/sounds/gameover.mp3');

  }


  play(name:string){

    const settings =
      this.storage.getSettings();

    if(!settings.sound) return;

    const audio =
      this.sounds[name];

    if(!audio) return;

    audio.currentTime = 0;

    audio.play();

  }

}