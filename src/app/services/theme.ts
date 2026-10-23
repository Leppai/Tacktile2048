import { Injectable } from '@angular/core';

export type ThemeName =
  | 'classic'
  | 'ocean'
  | 'neon'
  | 'forest'
  | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'selectedTheme';

  private currentTheme: ThemeName = 'classic';

  constructor() {
    this.loadTheme();
  }

  getTheme(): ThemeName {
    return this.currentTheme;
  }

  setTheme(theme: ThemeName): void {

    this.currentTheme = theme;

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    localStorage.setItem(
      this.THEME_KEY,
      theme
    );
  }

  private loadTheme(): void {

    const savedTheme =
      localStorage.getItem(this.THEME_KEY) as ThemeName | null;

    if (savedTheme && this.isValidTheme(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      this.currentTheme = 'classic';
    }

    document.documentElement.setAttribute(
      'data-theme',
      this.currentTheme
    );
  }

  private isValidTheme(theme: string): theme is ThemeName {

    return [
      'classic',
      'ocean',
      'neon',
      'forest',
      'dark'
    ].includes(theme);

  }

}