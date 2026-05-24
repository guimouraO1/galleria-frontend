import {Injectable} from '@angular/core';
import {AccessTokenPayload} from '../shared/interfaces/auth.interface';
import {jwtDecode} from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private readonly accessTokenKey = 'accessToken';

    getAccessToken() {
        return localStorage.getItem(this.accessTokenKey);
    }

    setAccessToken(accessToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken);
    }

    clearAccessToken() {
        localStorage.removeItem(this.accessTokenKey);
    }

    isAuthenticated() {
        return !!this.getAccessToken();
    }

    getPayload(): AccessTokenPayload | null {
        const accessToken = this.getAccessToken();
        return accessToken ? jwtDecode<AccessTokenPayload>(accessToken) : null;
    }

    getUserId() {
        const id = Number(this.getPayload()?.sub);
        return Number.isFinite(id) ? id : null;
    }

    getLogin() {
        return this.getPayload()?.login ?? '';
    }
}
