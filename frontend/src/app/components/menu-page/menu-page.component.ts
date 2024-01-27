import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainService } from '../../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss'
})
export class MenuPageComponent {
  roomCode?: number;

  constructor(private readonly service: MainService, private readonly router: Router) { }

  newRoom(): void {
    this.service.newRoom().subscribe(data => this.router.navigate([1, data.id]));
  }

  joinRoom(): void {
    this.service.joinRoom(this.roomCode ?? -1).subscribe(data => {
      if (data) {
        this.router.navigate([2, this.roomCode])
      }
    });
  }
}
