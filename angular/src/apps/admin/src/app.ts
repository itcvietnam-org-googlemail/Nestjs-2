import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from '@package/auth';
import { User } from '@package/user';

import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Auth, User, MatButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular!');
}