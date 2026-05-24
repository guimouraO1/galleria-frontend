import {Component, OnInit, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderService} from '../../../../services/order-service';
import {disabled, form, maxLength, minLength, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ClientService} from '../../../../services/client-service';
import {ProductService} from '../../../../services/product-service';
import {Client} from '../../../../shared/interfaces/client.interface';
import {Product} from '../../../../shared/interfaces/product.interface';

@UntilDestroy()
@Component({
    selector: 'app-order-new',
    imports: [RouterLink, TranslateModule, ButtonModule, CardModule, InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, MultiSelectModule, FormField],
    templateUrl: './order-new.html'
})
export class OrderNew implements OnInit {

    private orderService = inject(OrderService);
    private clientService = inject(ClientService);
    private productService = inject(ProductService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected isLoading = signal(false);
    protected isLoadingClients = signal(false);
    protected isLoadingProducts = signal(false);
    protected clients = signal<Client[]>([]);
    protected products = signal<Product[]>([]);
    protected hasMoreClients = signal(false);
    protected hasMoreProducts = signal(false);

    private readonly optionsLimit = 10;
    private nextClientCursor = signal<string | null>(null);
    private nextProductCursor = signal<string | null>(null);

    private order = signal({
        referenceCode: '',
        description: '',
        clientId: null as number | null,
        productIds: [] as number[]
    });

    protected orderForm = form(this.order, schemaPath => {
        disabled(schemaPath.referenceCode, () => this.isLoading());
        required(schemaPath.referenceCode, {message: 'app.pages.orders.validation.reference_code_required'});
        minLength(schemaPath.referenceCode, 3, {message: 'app.pages.orders.validation.reference_code_size'});
        maxLength(schemaPath.referenceCode, 100, {message: 'app.pages.orders.validation.reference_code_size'});

        disabled(schemaPath.description, () => this.isLoading());
        maxLength(schemaPath.description, 254, {message: 'app.pages.orders.validation.description_max'});

        disabled(schemaPath.clientId, () => this.isLoading());
        required(schemaPath.clientId, {message: 'app.pages.orders.validation.client_id_required'});

        disabled(schemaPath.productIds, () => this.isLoading());
        required(schemaPath.productIds, {message: 'app.pages.orders.validation.product_ids_required'});
        maxLength(schemaPath.productIds, 10, {message: 'app.pages.orders.validation.product_ids_max'});
    });

    ngOnInit() {
        this.loadClients();
        this.loadProducts();
    }

    protected loadClients(cursor: string | null = null) {
        this.isLoadingClients.set(true);

        this.clientService.list(cursor, this.optionsLimit)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.clients.update(clients => [...clients, ...response.items.filter(item => !clients.some(client => client.id === item.id))]);
                    this.nextClientCursor.set(response.nextCursor);
                    this.hasMoreClients.set(response.hasNext);
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('app.common.summary.error'),
                        detail: this.translateService.instant('app.common.errors.unexpected')
                    });
                }
            })
            .add(() => this.isLoadingClients.set(false));
    }

    protected loadMoreClients() {
        const cursor = this.nextClientCursor();

        if (cursor) {
            this.loadClients(cursor);
        }
    }

    protected loadProducts(cursor: string | null = null) {
        this.isLoadingProducts.set(true);

        this.productService.list(cursor, this.optionsLimit)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.products.update(products => [...products, ...response.items.filter(item => !products.some(product => product.id === item.id))]);
                    this.nextProductCursor.set(response.nextCursor);
                    this.hasMoreProducts.set(response.hasNext);
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('app.common.summary.error'),
                        detail: this.translateService.instant('app.common.errors.unexpected')
                    });
                }
            })
            .add(() => this.isLoadingProducts.set(false));
    }

    protected loadMoreProducts() {
        const cursor = this.nextProductCursor();

        if (cursor) {
            this.loadProducts(cursor);
        }
    }

    protected setClientId(clientId: number | null) {
        this.order.update(order => ({...order, clientId}));
    }

    protected setProductIds(productIds: number[]) {
        this.order.update(order => ({...order, productIds}));
    }

    protected submit(event: Event) {
        event.preventDefault();

        this.isLoading.set(true);

        this.orderService.create({
            referenceCode: this.order().referenceCode.trim(),
            description: this.order().description.trim(),
            clientId: this.order().clientId,
            productIds: this.order().productIds
        })
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => this.router.navigate(['/order']),
                error: (error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.BadRequest) {
                        return this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('app.common.summary.error'),
                            detail: this.translateService.instant('app.pages.orders.errors.invalid')
                        });
                    }

                    if (error.status === HttpStatusCode.NotFound) {
                        return this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('app.common.summary.error'),
                            detail: this.translateService.instant('app.common.errors.not_found')
                        });
                    }

                    if (error.status === HttpStatusCode.Forbidden) {
                        return this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('app.common.summary.error'),
                            detail: this.translateService.instant('app.common.errors.forbidden')
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
