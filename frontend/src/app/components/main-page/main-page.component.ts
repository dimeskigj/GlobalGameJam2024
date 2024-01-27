import { Component, OnInit, inject } from '@angular/core';
import { MainService } from '../../main.service';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { Database, object, ref } from '@angular/fire/database';

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
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  private db: Database = inject(Database);
  gameState?: GameStatus;
  playerNumber = 1;

  constructor(private readonly service: MainService, private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.playerNumber = Number(params.get('player'));
        const gameId = Number(params.get('id'));
        return of(gameId);
      })
    ).subscribe(
      id => {
        const item = ref(this.db, `games/${id}`);
        const obj = object(item);
        obj.subscribe(item => { this.gameState = item.snapshot.val(); console.log(this.gameState); });
      }
    );
  }
}
