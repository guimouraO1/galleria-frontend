import {ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth-service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    return AuthService.isAuthenticated() ? true : createUrlTreeFromSnapshot(route, ['/login']);
};
