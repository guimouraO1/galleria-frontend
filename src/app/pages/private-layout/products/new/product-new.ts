import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {ProductService} from '../../../../services/product-service';
import {disabled, form, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@UntilDestroy()
@Component({
    selector: 'app-product-new',
    imports: [RouterLink, TranslateModule, ButtonModule, CardModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormField],
    templateUrl: './product-new.html'
})
export class ProductNew {

    private productService = inject(ProductService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected isLoading = signal(false);

    private product = signal({
        description: '',
        value: ''
    });

    protected productForm = form(this.product, schemaPath => {
        disabled(schemaPath.description, () => this.isLoading());
        required(schemaPath.description, {message: 'app.pages.products.validation.description_required'});

        disabled(schemaPath.value, () => this.isLoading());
        required(schemaPath.value, {message: 'app.pages.products.validation.value_required'});
    });

    protected submit(event: Event) {
        event.preventDefault();
        this.isLoading.set(true);

        this.productService.create({
            description: this.product().description,
            value: Number(this.product().value)
        })
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => this.router.navigate(['/product']),
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
