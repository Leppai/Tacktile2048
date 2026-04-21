import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
  standalone: false,
})
export class GameOverComponent {

  constructor(
    private router:Router,
  ) {}

  @Input()
  score:number = 0;


  @Input()
  bestScore:number = 0;


  @Input()
  totalMerge:number = 0;


  /*
  kirim event ke parent
  */

  @Output()
  retry = new EventEmitter<void>();


  /*
  trigger saat tombol Try Again ditekan
  */

  onRetry(){

    this.retry.emit();

  }

  goHome() {
    this.router.navigate(['/home']);
  }

}