import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-tutorial',
  templateUrl: './welcome-tutorial.component.html',
  styleUrls: ['./welcome-tutorial.component.scss'],
  standalone: false,
})
export class WelcomeTutorialComponent  {

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