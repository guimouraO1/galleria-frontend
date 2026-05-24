import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Client, CreateClientRequest, UpdateClientRequest} from '../shared/interfaces/client.interface';
import {CursorPaginatedResponse} from '../shared/interfaces/cursor-paginated-response.interface';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    private http = inject(HttpClient);

    list(cursor: string | null = null, limit = 10) {
        let params = new HttpParams().set('limit', limit);

        if (cursor) {
            params = params.set('cursor', cursor);
        }

        return this.http.get<CursorPaginatedResponse<Client>>('/client', {params});
    }

    create(body: CreateClientRequest) {
        return this.http.post<void>('/client', body);
    }

    get(id: number) {
        return this.http.get<Client>(`/client/${id}`);
    }

    update(id: number, body: UpdateClientRequest) {
        return this.http.put<void>(`/client/${id}`, body);
    }

    delete(id: number) {
        return this.http.delete<void>(`/client/${id}`);
    }
}
