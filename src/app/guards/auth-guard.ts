import {CanActivateFn, createUrlTreeFromSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../services/token-service';

export const authGuard: CanActivateFn = (route, _state) => {
    const tokenService = inject(TokenService);
    return tokenService.isAuthenticated() ? true : createUrlTreeFromSnapshot(route, ['/login']);
};
