import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {

  sound:boolean = true;

  constructor(
    private router:Router,
    private storage:StorageService,
  ) {}
  

  ngOnInit(){

    const settings = this.storage.getSettings();

    this.sound = settings.sound;

  }


  goHome(){

    this.router.navigate(['/home']);

  }


  toggleSound(event:any){

    const settings = this.storage.getSettings();

    settings.sound = event.detail.checked;

    this.storage.saveSettings(settings);

  }


  openHowToPlay(){

    this.router.navigate(['/how-to-play']);

  }


  openPolicy(){

    this.router.navigate(['/privacy-policy']);

  }


  resetProgress(){

    this.storage.resetGame();

    alert('Progress berhasil direset');

  }


  saveSettings(){

    const settings = {

      sound:this.sound

    };

    localStorage.setItem(
      'settings',
      JSON.stringify(settings)
    );

  }

}