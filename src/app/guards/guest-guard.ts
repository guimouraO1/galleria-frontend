import {ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth-service';

export const guestGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    return AuthService.isAuthenticated() ? createUrlTreeFromSnapshot(route, ['/dashboard']) : true;
};
