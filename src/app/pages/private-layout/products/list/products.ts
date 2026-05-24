import {Component, OnInit, computed, inject, signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ProductService} from '../../../../services/product-service';
import {Product} from '../../../../shared/interfaces/product.interface';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {SkeletonModule} from 'primeng/skeleton';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-products',
    imports: [CurrencyPipe, RouterLink, TranslateModule, ButtonModule, TableModule, SkeletonModule],
    templateUrl: './products.html'
})
export class Products implements OnInit {

    private productService = inject(ProductService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);
    private router = inject(Router);

    protected products = signal<Product[]>([]);
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

    protected open(id: number) {
        this.router.navigate(['/product', id]);
    }

    private load(cursor: string | null = null) {
        this.isLoading.set(true);

        this.productService.list(cursor, this.pageSize)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.products.set(response.items);
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

    protected delete(id: number) {
        this.confirmationService.confirm({
            header: this.translateService.instant('app.common.confirm.delete_title'),
            message: this.translateService.instant('app.common.confirm.delete_message'),
            acceptLabel: this.translateService.instant('app.common.actions.delete'),
            rejectLabel: this.translateService.instant('app.common.actions.cancel'),
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.productService.delete(id)
                    .pipe(untilDestroyed(this))
                    .subscribe({
                        next: () => this.products.update(products => products.filter(product => product.id !== id)),
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
                    });
            }
        });
    }
}
