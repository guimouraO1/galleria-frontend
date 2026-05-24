import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenService} from '../services/token-service';
import {Router} from '@angular/router';

export const baseInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const accessToken = tokenService.getAccessToken();

    const apiRequest = request.url.startsWith('/') && !request.url.startsWith('/i18n/')
        ? request.clone({
            url: `${environment.apiUrl}${request.url}`,
            withCredentials: true,
            setHeaders: accessToken ? {Authorization: `Bearer ${accessToken}`} : {}
        })
        : request;

    return next(apiRequest)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.Unauthorized && !apiRequest.url.includes('/login')) {
                    tokenService.clearAccessToken();
                    router.navigate(['/login']);
                }

                return throwError(() => error);
            })
        );
};
