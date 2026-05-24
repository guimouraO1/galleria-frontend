import {Component, OnInit, ViewChild, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputNumber, InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {ProductService} from '../../../../services/product-service';
import {disabled, form, max, maxLength, min, minLength, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-product-update',
    imports: [RouterLink, TranslateModule, ButtonModule, CardModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, InputTextModule, FormField],
    templateUrl: './product-update.html'
})
export class ProductUpdate implements OnInit {

    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    @ViewChild('valueInput') private valueInput?: InputNumber;

    protected isLoading = signal(false);
    protected id = Number(this.route.snapshot.paramMap.get('id'));

    private product = signal({
        description: '',
        value: null as number | null
    });

    protected productForm = form(this.product, schemaPath => {
        disabled(schemaPath.description, () => this.isLoading());
        required(schemaPath.description, {message: 'app.pages.products.validation.description_required'});
        minLength(schemaPath.description, 3, {message: 'app.pages.products.validation.description_size'});
        maxLength(schemaPath.description, 254, {message: 'app.pages.products.validation.description_size'});

        disabled(schemaPath.value, () => this.isLoading());
        required(schemaPath.value, {message: 'app.pages.products.validation.value_required'});
        min(schemaPath.value, 0.01, {message: 'app.pages.products.validation.value_min'});
        max(schemaPath.value, 9999999999999.99, {message: 'app.pages.products.validation.value_max'});
    });

    protected setValue(value: number | null) {
        this.product.update(product => ({...product, value}));
    }

    ngOnInit() {
        this.isLoading.set(true);

        this.productService.get(this.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: product => {
                    this.product.set({description: product.description, value: product.value});
                    this.valueInput?.writeValue(product.value);
                },
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

    protected submit(event: Event) {
        event.preventDefault();

        this.isLoading.set(true);

        this.productService.update(this.id, {
            description: this.product().description.trim(),
            value: this.product().value ?? 0
        })
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => this.router.navigate(['/product']),
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
