import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage';
import { Router } from '@angular/router';
import { SoundService } from 'src/app/services/sound';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.page.html',
  styleUrls: ['./gameboard.page.scss'],
  standalone: false,
})
export class GameboardPage implements OnInit {

  gridSize:number = 4;
  board:number[] = [];
  score:number = 0;
  bestScore:number = 0;
  startX:number = 0;
  startY:number = 0;
  gameOver:boolean = false;
  totalMerge:number = 0;


  constructor(
    private router:Router,
    private storage:StorageService,
    private sound:SoundService,
  ) {}


  ngOnInit(){

    const data = this.storage.getGameData();
    this.gridSize = data.gridSize;
    this.bestScore = data.bestScore;
    this.createBoard();

  }

  openSettings(){

    this.router.navigate(['/settings']);

  }

  createBoard(){

    this.board = new Array(
      this.gridSize * this.gridSize
    ).fill(0);

    this.score = 0;

    this.spawnTile();
    this.spawnTile();

  }

  goHome() {
    this.router.navigate(['/home']);
  }

  newGame(){

    this.gameOver = false;

    this.totalMerge = 0;

    this.score = 0;

    this.createBoard();

  }


  spawnTile(){

    const empty = this.board
      .map((v,i)=> v==0 ? i : null)
      .filter(v=> v!==null);

    if(empty.length == 0) return;

    const index = empty[
      Math.floor(Math.random()*empty.length)
    ];

    this.board[index!] =
      Math.random() > 0.9 ? 4 : 2;

  }


  move(direction:string){

    let moved = false;

    for(let i=0;i<this.gridSize;i++){

      let line = this.getLine(i,direction);

      let merged = this.mergeLine(line);

      this.setLine(i,merged,direction);

      if(JSON.stringify(line) != JSON.stringify(merged)){

        moved = true;

      }

    }

    if(moved){

      this.sound.play('move');

      this.spawnTile();

      this.updateBestScore();

      this.gameOver =
        this.checkGameOver();

      if(this.gameOver){

        this.sound.play('gameover');

      }

    }

  }

  checkGameOver(){

    // cek cell kosong
    if(this.board.includes(0)){

      return false;

    }

    // cek kemungkinan merge horizontal
    for(let r=0;r<this.gridSize;r++){

      for(let c=0;c<this.gridSize-1;c++){

        let i = r*this.gridSize+c;

        if(this.board[i] ==
          this.board[i+1]){

          return false;

        }

      }

    }


    // cek kemungkinan merge vertikal
    for(let c=0;c<this.gridSize;c++){

      for(let r=0;r<this.gridSize-1;r++){

        let i = r*this.gridSize+c;

        if(this.board[i] ==
          this.board[i+this.gridSize]){

          return false;

        }

      }

    }

    return true;

  }


  mergeLine(line:number[]){

    line = line.filter(v=> v!=0);

    for(let i=0;i<line.length-1;i++){

      if(line[i] == line[i+1]){

        this.sound.play('merge');

        line[i] *= 2;

        this.score += line[i];
        this.totalMerge += 1;
        line[i+1] = 0;

      }

    }

    line = line.filter(v=> v!=0);

    while(line.length < this.gridSize){

      line.push(0);

    }

    return line;

  }



  getLine(index:number,dir:string){

    let result:number[] = [];

    for(let i=0;i<this.gridSize;i++){

      if(dir=='left'){

        result.push(
          this.board[index*this.gridSize+i]
        );

      }

      if(dir=='right'){

        result.push(
          this.board[index*this.gridSize+(this.gridSize-1-i)]
        );

      }

      if(dir=='up'){

        result.push(
          this.board[i*this.gridSize+index]
        );

      }

      if(dir=='down'){

        result.push(
          this.board[(this.gridSize-1-i)*this.gridSize+index]
        );

      }

    }

    return result;

  }


  formatTile(value: number): string {
    if (value >= 10000 && value < 1000000) {
      return (value / 10000).toFixed(1).replace('.0', '') + 'K';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    return value.toString();
  }


  setLine(index:number,line:number[],dir:string){

    for(let i=0;i<this.gridSize;i++){

      if(dir=='left'){

        this.board[index*this.gridSize+i] = line[i];

      }

      if(dir=='right'){

        this.board[index*this.gridSize+(this.gridSize-1-i)] = line[i];

      }

      if(dir=='up'){

        this.board[i*this.gridSize+index] = line[i];

      }

      if(dir=='down'){

        this.board[(this.gridSize-1-i)*this.gridSize+index] = line[i];

      }

    }

  }



  updateBestScore(){

    const data = this.storage.getGameData();

    if(this.score > data.bestScore){

      data.bestScore = this.score;

      this.bestScore = this.score;

      this.storage.saveGameData(data);

    }

  }

  onTouchStart(e:any){

    this.startX =
      e.touches[0].clientX;

    this.startY =
      e.touches[0].clientY;

  }

  onTouchEnd(e:any){

    let dx =
      e.changedTouches[0].clientX - this.startX;

    let dy =
      e.changedTouches[0].clientY - this.startY;


    if(Math.abs(dx) < 30 &&
      Math.abs(dy) < 30){

      return;

    }


    if(Math.abs(dx) > Math.abs(dy)){

      if(dx > 0){

        this.move('right');

      }else{

        this.move('left');

      }

    }else{

      if(dy > 0){

        this.move('down');

      }else{

        this.move('up');

      }

    }

  }

}