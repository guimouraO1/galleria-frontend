import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../services/token-service';

export const guestGuard: CanActivateFn = () => {
    const tokenService = inject(TokenService);
    return tokenService.isAuthenticated() ? inject(Router).createUrlTree(['/dashboard']) : true;
};
