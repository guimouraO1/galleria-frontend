import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Product, ProductRequest} from '../shared/interfaces/product.interface';
import {CursorPaginatedResponse} from '../shared/interfaces/cursor-paginated-response.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private http = inject(HttpClient);

    list(cursor: string | null = null, limit = 10) {
        let params = new HttpParams().set('limit', limit);

        if (cursor) {
            params = params.set('cursor', cursor);
        }

        return this.http.get<CursorPaginatedResponse<Product>>('/product', {params});
    }

    create(body: ProductRequest) {
        return this.http.post<void>('/product', body);
    }

    get(id: number) {
        return this.http.get<Product>(`/product/${id}`);
    }

    update(id: number, body: ProductRequest) {
        return this.http.put<void>(`/product/${id}`, body);
    }

    delete(id: number) {
        return this.http.delete<void>(`/product/${id}`);
    }
}
