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

  constructor(
    private router:Router,
    private storage:StorageService,
  ) {}

  ngOnInit(){

    const data = this.storage.getGameData();

    this.selectedGrid = data.gridSize;
    this.bestScore = data.bestScore;

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