import {Component, OnInit, computed, inject, signal} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {OrderService} from '../../../../services/order-service';
import {Order} from '../../../../shared/interfaces/order.interface';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {SkeletonModule} from 'primeng/skeleton';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@UntilDestroy()
@Component({
    selector: 'app-orders',
    imports: [CurrencyPipe, DatePipe, RouterLink, TranslateModule, ButtonModule, TableModule, SkeletonModule],
    templateUrl: './orders.html'
})
export class Orders implements OnInit {

    private orderService = inject(OrderService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected orders = signal<Order[]>([]);
    protected isLoading = signal(true);
    protected hasNext = signal(false);
    protected hasPrevious = computed(() => this.cursorHistory().length > 0);

    private readonly pageSize = 10;
    private currentCursor = signal<string | null>(null);
    private nextCursor = signal<string | null>(null);
    private cursorHistory = signal<(string | null)[]>([]);

    ngOnInit() {
        this.load();
    }

    protected nextPage() {
        const cursor = this.nextCursor();

        if (!cursor) {
            return;
        }

        this.cursorHistory.update(history => [...history, this.currentCursor()]);
        this.load(cursor);
    }

    protected previousPage() {
        const history = this.cursorHistory();
        const cursor = history[history.length - 1] ?? null;

        this.cursorHistory.set(history.slice(0, -1));
        this.load(cursor);
    }

    private load(cursor: string | null = null) {
        this.isLoading.set(true);

        this.orderService.list(cursor, this.pageSize)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.orders.set(response.items);
                    this.currentCursor.set(cursor);
                    this.nextCursor.set(response.nextCursor);
                    this.hasNext.set(response.hasNext);
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('app.common.summary.error'),
                        detail: this.translateService.instant('app.common.errors.unexpected')
                    });
                }
            })
            .add(() => this.isLoading.set(false));
    }
}
