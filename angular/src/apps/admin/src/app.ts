import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

import {
    TranslateService,
    TranslatePipe
} from "@ngx-translate/core";

import { Auth } from '@package/auth';
import { User } from '@package/user';

import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Auth, User, MatButton, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('angular!');

    private translateService = inject(TranslateService);
}