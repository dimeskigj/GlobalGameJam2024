import { Component, OnInit, inject } from '@angular/core';
import { MainService } from '../../main.service';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { Database, object, ref } from '@angular/fire/database';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GameStatus {
  player1: PlayerStatus;
  player2: PlayerStatus;
  winner: number;
  theme: string;
}

interface PlayerStatus {
  joined: boolean;
  joke: string;
}

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  private db: Database = inject(Database);

  gameState: GameStatus | null = null;
  playerNumber = 1;
  gameId?: number;
  joke = "";
  hasSubmitted = false;

  constructor(private readonly service: MainService, private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.playerNumber = Number(params.get('player'));
        this.gameId = Number(params.get('id'));
        return of(this.gameId);
      }),
      switchMap(id => {
        const item = ref(this.db, `games/${id}`);
        const obj = object(item);
        return obj;
      })
    ).subscribe(
      item =>
        this.onGameStateUpdate(item.snapshot.val(), JSON.parse(JSON.stringify(this.gameState)))
    );
  }

  onGameStateUpdate(curr: GameStatus, old?: GameStatus) {
    this.gameState = curr;
    console.log({ old: old, new: curr });
  }

  onEnter() {
    if (!this.joke) return;

    this.hasSubmitted = true;
    this.service.submitJoke(this.gameId!, this.playerNumber, this.joke).subscribe();
  }
}
