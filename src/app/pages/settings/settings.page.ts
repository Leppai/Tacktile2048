import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {

  sound:boolean = true;
  showHowToPlay = false;

  constructor(
    private router:Router,
    private storage:StorageService,
    private alertCtrl:AlertController,
  ) {}
  

  ngOnInit(){

    const settings = this.storage.getSettings();

    this.sound = settings.sound;

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


  openPrivacyPolicy(){

    this.router.navigate(['/privacy-policy']);

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