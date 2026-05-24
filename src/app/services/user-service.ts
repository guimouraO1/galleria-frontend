import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {User} from '../shared/interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);

    create(login: string, password: string, name: string) {
        return this.http.post('/user', {login, password, name});
    }

    get(id: number) {
        return this.http.get<User>(`/user/${id}`);
    }

    update(id: number, name: string, password: string) {
        return this.http.put<void>(`/user/${id}`, {name, password});
    }

    delete(id: number) {
        return this.http.delete<void>(`/user/${id}`);
    }
}
