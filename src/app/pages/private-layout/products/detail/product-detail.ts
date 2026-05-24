import {CurrencyPipe} from '@angular/common';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {Component, OnInit, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {MessageService} from 'primeng/api';
import {ProductService} from '../../../../services/product-service';
import {Product} from '../../../../shared/interfaces/product.interface';

@UntilDestroy()
@Component({
    selector: 'app-product-detail',
    imports: [CurrencyPipe, RouterLink, TranslateModule, ButtonModule, CardModule],
    templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {

    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected product = signal<Product | null>(null);
    protected isLoading = signal(true);

    private id = Number(this.route.snapshot.paramMap.get('id'));

    ngOnInit() {
        this.productService.get(this.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: product => this.product.set(product),
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
