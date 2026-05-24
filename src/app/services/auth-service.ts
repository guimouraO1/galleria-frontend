import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {inject} from '@angular/core/primitives/di';
import {Observable, tap} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);

    public refreshToken$: Observable<string> | null = null;

    static isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    }

    static clearAuth() {
        localStorage.removeItem('accessToken');
    }

    login(login: string, password: string) {
        return this.http.post<{accessToken: string}>('/login', {login, password})
            .pipe(
                tap(({accessToken}) => localStorage.setItem('accessToken', accessToken))
            );
    }

    refreshToken() {
        return this.http.post<{accessToken: string}>('/refresh-token', {})
            .pipe(
                tap(({accessToken}) => localStorage.setItem('accessToken', accessToken))
            );
    }
}
