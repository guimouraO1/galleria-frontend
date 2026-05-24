import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {inject} from '@angular/core/primitives/di';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);

    createUser(login: string, password: string, name: string) {
        return this.http.post('/user', {login, password, name});
    }
}
