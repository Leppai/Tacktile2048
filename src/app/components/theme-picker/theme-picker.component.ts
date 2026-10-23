import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  standalone: false
})
export class ThemePickerComponent {

  @Output() close = new EventEmitter<void>();

  @Output() themeSelected = new EventEmitter<string>();

  selectedTheme: string = 'classic';


  selectTheme(theme: string) {

    this.selectedTheme = theme;

    this.themeSelected.emit(theme);

  }


  closePicker() {

    this.close.emit();

  }

}