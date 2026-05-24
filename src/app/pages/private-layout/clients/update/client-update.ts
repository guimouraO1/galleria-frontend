import {Component, OnInit, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {ClientService} from '../../../../services/client-service';
import {disabled, form, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-client-update',
    imports: [RouterLink, TranslateModule, ButtonModule, CardModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormField],
    templateUrl: './client-update.html'
})
export class ClientUpdate implements OnInit {

    private clientService = inject(ClientService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected isLoading = signal(false);
    protected id = Number(this.route.snapshot.paramMap.get('id'));

    private client = signal({
        name: '',
        phone: ''
    });

    protected clientForm = form(this.client, schemaPath => {
        disabled(schemaPath.name, () => this.isLoading());
        required(schemaPath.name, {message: 'app.pages.clients.validation.name_required'});

        disabled(schemaPath.phone, () => this.isLoading());
        required(schemaPath.phone, {message: 'app.pages.clients.validation.phone_required'});
    });

    ngOnInit() {
        this.isLoading.set(true);

        this.clientService.get(this.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: client => this.client.set({name: client.name, phone: client.phone}),
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

        this.clientService.update(this.id, this.client())
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => this.router.navigate(['/client']),
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
