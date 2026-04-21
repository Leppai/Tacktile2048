import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  selectedGrid:number = 4;
  bestScore:number = 0;
  showHowToPlay = false;
  showPrivacyConsent = false;

  constructor(
    private router:Router,
    private storage:StorageService,
  ) {}

  ngOnInit(){

    const data = this.storage.getGameData();

    this.selectedGrid = data.gridSize;
    this.bestScore = data.bestScore;
    this.checkTutorial();

    const accepted =
    localStorage.getItem('tactile_privacyAccepted');
    if(!accepted){
      this.showPrivacyConsent = true;
    }

  }

  ionViewWillEnter(){

    const data = this.storage.getGameData();
    this.selectedGrid = data.gridSize;
    this.bestScore = data.bestScore;

  }


  acceptPrivacy(){

    localStorage.setItem(
      'tactile_privacyAccepted',
      'true'
    );

    this.showPrivacyConsent = false;

  }


  checkTutorial() {

    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');

    if (!hasSeenTutorial) {

      this.showHowToPlay = true;

    }

  }


  closeHowToPlay() {

    this.showHowToPlay = false;

    localStorage.setItem('hasSeenTutorial', 'true');

  }


  selectGrid(size:number){

    this.selectedGrid = size;

  }

  openSettings(){

    this.router.navigate(['/settings']);

  }

  startGame(){

    this.storage.saveGameData({

      gridSize:this.selectedGrid,
      bestScore:this.bestScore

    });

    this.router.navigate(['/gameboard']);

  }

}