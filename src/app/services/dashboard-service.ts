import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {DashboardResponse} from '../shared/interfaces/dashboard.interface';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private http = inject(HttpClient);

    get(date: string) {
        const params = new HttpParams().set('date', date);

        return this.http.get<DashboardResponse>('/dashboard', {params});
    }
}
