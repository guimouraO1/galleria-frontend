import 'chart.js/auto';

import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {Component, OnInit, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {DatePickerModule} from 'primeng/datepicker';
import {MessageService} from 'primeng/api';
import {SkeletonModule} from 'primeng/skeleton';
import {DashboardService} from '../../../services/dashboard-service';
import {DashboardCountMetric, DashboardMoneyMetric, DashboardResponse} from '../../../shared/interfaces/dashboard.interface';
import {LongDatePipe} from '../../../shared/pipes/long-date.pipe';

interface DashboardMetricCard {
    label: string;
    icon: string;
    metric: DashboardMoneyMetric | DashboardCountMetric;
    money: boolean;
}

@UntilDestroy()
@Component({
    selector: 'app-dashboard',
    imports: [CurrencyPipe, DecimalPipe, FormsModule, TranslateModule, ButtonModule, CardModule, ChartModule, DatePickerModule, SkeletonModule, LongDatePipe],
    templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

    private dashboardService = inject(DashboardService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected selectedDate = signal(new Date());
    protected dashboard = signal<DashboardResponse | null>(null);
    protected isLoading = signal(true);

    private chartLanguage = signal(this.translateService.currentLang);

    protected metrics = computed<DashboardMetricCard[]>(() => {
        const dashboard = this.dashboard();

        if (!dashboard) {
            return [];
        }

        return [
            {
                label: 'app.pages.dashboard.metrics.orders_total',
                icon: 'pi pi-dollar',
                metric: dashboard.ordersTotal,
                money: true
            },
            {
                label: 'app.pages.dashboard.metrics.orders_count',
                icon: 'pi pi-shopping-cart',
                metric: dashboard.ordersCount,
                money: false
            },
            {
                label: 'app.pages.dashboard.metrics.new_products',
                icon: 'pi pi-box',
                metric: dashboard.newProducts,
                money: false
            },
            {
                label: 'app.pages.dashboard.metrics.new_clients',
                icon: 'pi pi-users',
                metric: dashboard.newClients,
                money: false
            },
            {
                label: 'app.pages.dashboard.metrics.new_users',
                icon: 'pi pi-user-plus',
                metric: dashboard.newUsers,
                money: false
            }
        ];
    });

    protected chartData = computed(() => {
        const metrics = this.metrics();
        this.chartLanguage();

        return {
            labels: metrics.map(metric => this.translateService.instant(metric.label)),
            datasets: [
                {
                    label: this.translateService.instant('app.pages.dashboard.chart.percentage'),
                    data: metrics.map(metric => this.toNumber(metric.metric.percentage)),
                    backgroundColor: metrics.map(metric => this.toNumber(metric.metric.percentage) >= 0 ? '#22c55e' : '#ef4444'),
                    borderRadius: 6
                }
            ]
        };
    });

    protected chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: number | string) => `${value}%`
                }
            }
        }
    };

    ngOnInit() {
        this.translateService.onLangChange
            .pipe(untilDestroyed(this))
            .subscribe(event => this.chartLanguage.set(event.lang));

        this.load();
    }

    protected changeDate(date: Date | null) {
        if (!date) {
            return;
        }

        this.selectedDate.set(date);
        this.load();
    }

    protected load() {
        this.isLoading.set(true);

        this.dashboardService.get(this.formatRequestDate(this.selectedDate()))
            .pipe(untilDestroyed(this))
            .subscribe({
                next: dashboard => this.dashboard.set(dashboard),
                error: (error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.BadRequest) {
                        return this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('app.common.summary.error'),
                            detail: this.translateService.instant('app.pages.dashboard.errors.invalid_date')
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

    protected toNumber(value: number | string | null | undefined) {
        return Number(value ?? 0);
    }

    private formatRequestDate(date: Date) {
        return DateTime.fromJSDate(date).toFormat('dd-MM-yyyy');
    }

}
