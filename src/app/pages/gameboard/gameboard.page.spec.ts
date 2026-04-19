import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameboardPage } from './gameboard.page';

describe('GameboardPage', () => {
  let component: GameboardPage;
  let fixture: ComponentFixture<GameboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
