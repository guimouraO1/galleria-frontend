import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {tap} from 'rxjs';
import {TokenService} from './token-service';
import {LoginResponse} from '../shared/interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
    private tokenService = inject(TokenService);

    login(login: string, password: string) {
        return this.http.post<LoginResponse>('/login', {login, password})
            .pipe(
                tap(({accessToken}) => this.tokenService.setAccessToken(accessToken))
            );
    }
}
