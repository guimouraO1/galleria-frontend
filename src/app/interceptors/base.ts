import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, finalize, map, shareReplay, switchMap, take, throwError} from 'rxjs';
import {AuthService} from '../services/auth-service';
import {environment} from '../../environments/environment';

export const baseInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const isRelativeApiRequest = request.url.startsWith('/') && !request.url.startsWith('/i18n/');

    const apiRequest = isRelativeApiRequest ? request.clone({url: `${environment.apiUrl}${request.url}`, withCredentials: true}) : request;

    return next(apiRequest)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Unauthorized || apiRequest.url.includes('/login') || apiRequest.url.includes('/refresh-token')) {
                    return throwError(() => error);
                }

                if (!authService.refreshToken$) {
                    authService.refreshToken$ = authService
                        .refreshToken()
                        .pipe(
                            map(({accessToken}) => accessToken),
                            finalize(() => authService.refreshToken$ = null),
                            shareReplay({bufferSize: 1, refCount: false}),
                            catchError((error) => {
                                AuthService.clearAuth();
                                return throwError(() => error);
                            })
                        );
                }

                return authService.refreshToken$.pipe(
                    take(1),
                    switchMap(() => next(apiRequest))
                );
            })
        );
};
