import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from '@package/auth';
import { User } from '@package/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Auth, User],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular!');
}