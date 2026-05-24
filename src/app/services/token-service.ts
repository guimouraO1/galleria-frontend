import {Injectable} from '@angular/core';

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
}
