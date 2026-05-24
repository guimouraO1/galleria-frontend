import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {CreateOrderRequest, Order} from '../shared/interfaces/order.interface';
import {CursorPaginatedResponse} from '../shared/interfaces/cursor-paginated-response.interface';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private http = inject(HttpClient);

    list(cursor: string | null = null, limit = 10) {
        let params = new HttpParams().set('limit', limit);

        if (cursor) {
            params = params.set('cursor', cursor);
        }

        return this.http.get<CursorPaginatedResponse<Order>>('/order', {params});
    }

    create(body: CreateOrderRequest) {
        return this.http.post<void>('/order', body);
    }

    get(id: number) {
        return this.http.get<Order>(`/order/${id}`);
    }
}
