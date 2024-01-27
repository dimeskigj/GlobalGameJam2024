import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000'

interface NewGameDto {
  id: number
}

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(private readonly http: HttpClient) { }

  newRoom(): Observable<NewGameDto> {
    return this.http.post<NewGameDto>(API_URL, null);
  }

  joinRoom(id: number): Observable<boolean> {
    return this.http.post<boolean>(`${API_URL}/join/${id}`, null);
  }

  submitJoke(id: number, player: number, joke: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/game/${id}`, {
      player: player,
      text: joke
    });
  }
}
