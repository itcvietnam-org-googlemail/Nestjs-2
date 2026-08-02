import { Component, signal, inject } from '@angular/core';

import {
    TranslateService,
    TranslatePipe
} from "@ngx-translate/core";

import { Auth } from '@package/auth';

import {MatButton} from '@angular/material/button';

@Component({
  selector: 'article',
  imports: [TranslatePipe],
  templateUrl: './article.html',
  styleUrl: './article.scss'
})
export class Article {
    protected readonly title = signal('Article!');
    public count: number = 12;

    private translateService = inject(TranslateService);
}