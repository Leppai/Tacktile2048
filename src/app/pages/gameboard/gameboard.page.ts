import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage';
import { SoundService } from 'src/app/services/sound';

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;

  isNew: boolean;

  isMerged: boolean;
}



@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.page.html',
  styleUrls: ['./gameboard.page.scss'],
  standalone: false,
})
export class GameboardPage implements OnInit, AfterViewInit, OnDestroy {


  gridSize: number = 4;

  tiles: Tile[] = [];

  private nextTileId: number = 0;

  board: number[] = [];

  score: number = 0;
  bestScore: number = 0;
  totalMerge: number = 0;

  gameOver: boolean = false;


  startX: number = 0;
  startY: number = 0;

  tileSize: number = 0;

  private readonly gap: number = 6;

  @ViewChild('boardGrid') boardGridEl!: ElementRef;

  private resizeObserver!: ResizeObserver;

  isAnimating: boolean = false;

  private readonly animationDuration: number = 150;

  constructor(
    private router: Router,
    private storage: StorageService,
    private sound: SoundService,
    private cdr: ChangeDetectorRef,
  ) {}


  ngOnInit(): void {
    const data = this.storage.getGameData();

    this.gridSize = data.gridSize;
    this.bestScore = data.bestScore;

    this.createBoard();
  }

  ngAfterViewInit(): void {
    /*
     * ResizeObserver mengukur ukuran cell nyata dari DOM
     * setiap kali ukuran board-grid berubah.
     *
     * Ini menggantikan cellSize yang dulu hardcoded 100px,
     * sehingga posisi tile selalu akurat di semua layar.
     */
    this.resizeObserver = new ResizeObserver(() => {
      this.measureTileSize();
      this.cdr.detectChanges();
    });

    this.resizeObserver.observe(
      this.boardGridEl.nativeElement
    );
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }


  // ====================================================
  // TILE SIZE MEASUREMENT
  // ====================================================

  private measureTileSize(): void {
    const grid =
      this.boardGridEl.nativeElement as HTMLElement;

    /*
     * Ukur cell-bg pertama yang sudah dirender oleh
     * CSS Grid. Hasilnya adalah ukuran tile yang
     * tepat untuk layar saat ini.
     */
    const cellEl =
      grid.querySelector('.cell-bg') as HTMLElement;

    if (cellEl) {
      this.tileSize = cellEl.offsetWidth;
    }
  }


  // ====================================================
  // NAVIGATION
  // ====================================================

  openSettings(): void {
    this.router.navigate(['/settings']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }


  // ====================================================
  // BOARD HELPERS
  // ====================================================

  /**
   * Array sel background untuk *ngFor pada template.
   */
  get bgCells(): number[] {
    return new Array(
      this.gridSize * this.gridSize
    ).fill(0);
  }

  /**
   * trackBy function untuk *ngFor tiles.
   *
   * Kunci dari sistem animasi ini:
   * Angular menggunakan elemen DOM yang SAMA saat tile
   * berpindah posisi (bukan destroy + recreate baru).
   * Ketika style transform berubah pada elemen yang sama,
   * CSS transition otomatis menganimasikan perpindahannya.
   */
  trackTile(index: number, tile: Tile): number {
    return tile.id;
  }

  /**
   * Sinkronkan board[] dari tiles[] aktif,
   * agar logika checkGameOver bisa berjalan.
   */
  private syncBoardFromTiles(): void {
    this.board = new Array(
      this.gridSize * this.gridSize
    ).fill(0);

    this.tiles.forEach(t => {
      this.board[t.row * this.gridSize + t.col] = t.value;
    });
  }


  createBoard(): void {
    this.tiles = [];
    this.board = new Array(
      this.gridSize * this.gridSize
    ).fill(0);

    this.score = 0;
    this.gameOver = false;
    this.nextTileId = 0;

    // Tambahkan 2 tile awal.
    this.spawnTile();
    this.spawnTile();
  }

  newGame(): void {
    this.isAnimating = false;
    this.totalMerge = 0;

    this.createBoard();
  }


  spawnTile(): void {
    const occupied = new Set(
      this.tiles.map(t => t.row * this.gridSize + t.col)
    );

    const empty: number[] = [];

    for (
      let i = 0;
      i < this.gridSize * this.gridSize;
      i++
    ) {
      if (!occupied.has(i)) {
        empty.push(i);
      }
    }

    if (empty.length === 0) return;

    const idx = empty[
      Math.floor(Math.random() * empty.length)
    ];

    // 80% kemungkinan muncul angka 2,
    // 20% kemungkinan muncul angka 4.
    this.tiles.push({
      id: this.nextTileId++,
      value: Math.random() > 0.8 ? 4 : 2,
      row: Math.floor(idx / this.gridSize),
      col: idx % this.gridSize,
      isNew: true,
      isMerged: false,
    });
  }


  move(direction: string): void {

    if (this.isAnimating) {
      return;
    }

    const tileMap = new Map<number, Tile>();

    this.tiles.forEach(t => {
      tileMap.set(
        t.row * this.gridSize + t.col,
        t
      );
    });

    let moved = false;

    const toRemove = new Set<number>();


    for (
      let lineIndex = 0;
      lineIndex < this.gridSize;
      lineIndex++
    ) {

      const lineTiles: Tile[] = [];

      for (let i = 0; i < this.gridSize; i++) {

        const idx = this.getBoardIndex(
          lineIndex, i, direction
        );

        const tile = tileMap.get(idx);

        if (tile) {
          lineTiles.push(tile);
        }
      }


      let writePos = 0;
      let lastWrittenTile: Tile | null = null;


      for (const tile of lineTiles) {

        const targetIdx = this.getTargetIndex(
          lineIndex, writePos, direction
        );

        const targetRow =
          Math.floor(targetIdx / this.gridSize);

        const targetCol =
          targetIdx % this.gridSize;


        if (
          lastWrittenTile &&
          lastWrittenTile.value === tile.value
        ) {


          if (
            tile.row !== lastWrittenTile.row ||
            tile.col !== lastWrittenTile.col
          ) {
            moved = true;
          }

          tile.row = lastWrittenTile.row;
          tile.col = lastWrittenTile.col;

          toRemove.add(tile.id);

          lastWrittenTile.value *= 2;
          lastWrittenTile.isMerged = true;

          this.score += lastWrittenTile.value;
          this.totalMerge += 1;

          this.sound.play('merge');


          lastWrittenTile = null;

        } else {

          if (
            tile.row !== targetRow ||
            tile.col !== targetCol
          ) {
            moved = true;
          }

          tile.row = targetRow;
          tile.col = targetCol;

          lastWrittenTile = tile;
          writePos++;
        }
      }
    }


    if (!moved) {
      return;
    }

    this.isAnimating = true;

    // Mainkan suara gerakan.
    this.sound.play('move');


    setTimeout(() => {

      this.tiles =
        this.tiles.filter(
          t => !toRemove.has(t.id)
        );

      this.tiles.forEach(t => {
        t.isMerged = false;
        t.isNew    = false;
      });

      this.spawnTile();

      this.syncBoardFromTiles();

      this.updateBestScore();

      this.gameOver =
        this.checkGameOver();

      if (this.gameOver) {
        this.sound.play('gameover');
      }

      this.isAnimating = false;

    }, this.animationDuration);
  }



  private getBoardIndex(
    lineIndex: number,
    position: number,
    direction: string
  ): number {

    switch (direction) {

      case 'left':
        return (
          lineIndex * this.gridSize +
          position
        );


      case 'right':
        return (
          lineIndex * this.gridSize +
          (this.gridSize - 1 - position)
        );


      case 'up':
        return (
          position * this.gridSize +
          lineIndex
        );


      case 'down':
        return (
          (this.gridSize - 1 - position) *
            this.gridSize +
          lineIndex
        );


      default:
        return (
          lineIndex * this.gridSize +
          position
        );
    }
  }


  private getTargetIndex(
    lineIndex: number,
    targetPosition: number,
    direction: string
  ): number {

    switch (direction) {

      case 'left':
        return (
          lineIndex * this.gridSize +
          targetPosition
        );


      case 'right':
        return (
          lineIndex * this.gridSize +
          (this.gridSize - 1 - targetPosition)
        );


      case 'up':
        return (
          targetPosition * this.gridSize +
          lineIndex
        );


      case 'down':
        return (
          (this.gridSize - 1 - targetPosition) *
            this.gridSize +
          lineIndex
        );


      default:
        return (
          lineIndex * this.gridSize +
          targetPosition
        );
    }
  }



  checkGameOver(): boolean {

    if (this.board.includes(0)) {
      return false;
    }


    for (
      let row = 0;
      row < this.gridSize;
      row++
    ) {

      for (
        let col = 0;
        col < this.gridSize - 1;
        col++
      ) {

        const index =
          row * this.gridSize + col;


        if (
          this.board[index] ===
          this.board[index + 1]
        ) {
          return false;
        }
      }
    }


    for (
      let col = 0;
      col < this.gridSize;
      col++
    ) {

      for (
        let row = 0;
        row < this.gridSize - 1;
        row++
      ) {

        const index =
          row * this.gridSize + col;


        if (
          this.board[index] ===
          this.board[index + this.gridSize]
        ) {
          return false;
        }
      }
    }


    return true;
  }


  getTileTransform(tile: Tile): string {
    const x = tile.col * (this.tileSize + this.gap);
    const y = tile.row * (this.tileSize + this.gap);
    return `translate(${x}px, ${y}px)`;
  }


  formatTile(value: number): string {

    /*
     * 1.000.000 -> 1M
     */
    if (value >= 1_000_000) {

      return (
        (value / 1_000_000)
          .toFixed(1)
          .replace('.0', '') +
        'M'
      );
    }



    if (value >= 10_000) {

      return (
        (value / 1_000)
          .toFixed(1)
          .replace('.0', '') +
        'K'
      );
    }


    return value.toString();
  }


  updateBestScore(): void {

    const data =
      this.storage.getGameData();


    if (
      this.score > data.bestScore
    ) {

      data.bestScore =
        this.score;

      this.bestScore =
        this.score;


      this.storage.saveGameData(data);
    }
  }



  onTouchStart(e: any): void {

    this.startX =
      e.touches[0].clientX;

    this.startY =
      e.touches[0].clientY;
  }


  onTouchEnd(e: any): void {

    const dx =
      e.changedTouches[0].clientX -
      this.startX;

    const dy =
      e.changedTouches[0].clientY -
      this.startY;



    if (
      Math.abs(dx) < 30 &&
      Math.abs(dy) < 30
    ) {
      return;
    }


    if (
      Math.abs(dx) > Math.abs(dy)
    ) {

      // Horizontal.
      this.move(
        dx > 0 ? 'right' : 'left'
      );

    } else {

      // Vertikal.
      this.move(
        dy > 0 ? 'down' : 'up'
      );
    }
  }

}