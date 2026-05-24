import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateService} from '@ngx-translate/core';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {baseInterceptor} from './interceptors/base';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([baseInterceptor])),
        provideTranslateService({
            fallbackLang: 'pt-br',
            loader: provideTranslateHttpLoader({
                prefix: '/i18n/',
                suffix: '.json',
                useHttpBackend: true
            })
        }),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: false
                }
            }
        })
    ]
};
