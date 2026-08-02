import { Routes } from '@angular/router';

import { provideTranslationFeature } from './translation-feature.provider';

export const articleRoutes: Routes = [
    {
        path: 'article',
        providers: [
            provideTranslationFeature('article')
        ],
        loadComponent: () => import('./article').then(module => module.Article)
    }
];