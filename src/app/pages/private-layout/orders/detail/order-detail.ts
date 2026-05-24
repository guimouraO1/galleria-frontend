import {CurrencyPipe} from '@angular/common';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {Component, OnInit, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {MessageService} from 'primeng/api';
import {OrderService} from '../../../../services/order-service';
import {Order} from '../../../../shared/interfaces/order.interface';
import {LongDatePipe} from '../../../../shared/pipes/long-date.pipe';

@UntilDestroy()
@Component({
    selector: 'app-order-detail',
    imports: [CurrencyPipe, RouterLink, TranslateModule, ButtonModule, CardModule, TableModule, LongDatePipe],
    templateUrl: './order-detail.html'
})
export class OrderDetail implements OnInit {

    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected order = signal<Order | null>(null);
    protected isLoading = signal(true);

    private id = Number(this.route.snapshot.paramMap.get('id'));

    ngOnInit() {
        this.orderService.get(this.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: order => this.order.set(order),
                error: (error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.NotFound) {
                        return this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('app.common.summary.error'),
                            detail: this.translateService.instant('app.common.errors.not_found')
                        });
                    }

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
