import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss'],
  standalone: false,
})
export class HowToPlayComponent {

  step = 1;

  @Output() close = new EventEmitter<void>();


  next() {
    if (this.step < 3) {
      this.step++;
    }
  }


  prev() {
    if (this.step > 1) {
      this.step--;
    }
  }


  goTo(stepNumber: number) {
    this.step = stepNumber;
  }


  finish() {
    this.close.emit();
  }

}