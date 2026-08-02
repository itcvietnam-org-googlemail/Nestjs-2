import { makeEnvironmentProviders, EnvironmentProviders } from '@angular/core';

import { provideChildTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export function provideTranslationFeature(feature: string): EnvironmentProviders {
    return makeEnvironmentProviders(
        provideChildTranslateService({
            loader: provideTranslateHttpLoader({
                prefix: '/translations/',
                suffix: `/${feature}.json`
            })
        })
    );
}