import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import {
  ThemeService,
  ThemeName
} from 'src/app/services/theme';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {

  showThemePicker = false;
  currentTheme: ThemeName = 'classic';
  sound:boolean = true;
  showHowToPlay = false;

  constructor(
    private storage:StorageService,
    private alertCtrl:AlertController,
    private themeService: ThemeService,
  ) {}
  

  ngOnInit(){

    const settings = this.storage.getSettings();

    this.sound = settings.sound;

    this.currentTheme = this.themeService.getTheme();

  }

  openThemeSettings() {
    this.showThemePicker = true;
  }

  closeThemePicker() {
    this.showThemePicker = false;
  }

  selectTheme(theme: string) {
    this.currentTheme = theme as ThemeName;
    this.themeService.setTheme(this.currentTheme);

    this.showThemePicker = false;
  }

  async resetProgress(){

    const alert =
      await this.alertCtrl.create({

      header:'Reset Progress',

      message:'Score dan data game akan dihapus.',

      buttons:[

        {

          text:'Cancel',
          role:'cancel'

        },

        {

          text:'Reset',
          role:'destructive',

          handler:()=>{

            this.confirmReset();

          }

        }

      ]

    });

    await alert.present();

  }

  confirmReset(){

    const defaultData = {

      gridSize:4,
      bestScore:0

    };

    this.storage.saveGameData(
      defaultData
    );

  }


  toggleSound(event:any){

    this.sound =
      event.detail.checked;

    this.storage.saveSettings({

      sound:this.sound

    });

  }


  openHowToPlay(){
    this.showHowToPlay = true;
  }


  closeHowToPlay(){
    this.showHowToPlay = false;
  }


  async openPrivacyPolicy() {
    await Browser.open({
      url: 'https://leppai.github.io/privacy2048/',
    });
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