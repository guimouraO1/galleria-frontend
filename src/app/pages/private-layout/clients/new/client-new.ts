import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {ClientService} from '../../../../services/client-service';
import {disabled, form, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-client-new',
    imports: [RouterLink, TranslateModule, ButtonModule, CardModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormField],
    templateUrl: './client-new.html'
})
export class ClientNew {

    private clientService = inject(ClientService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected isLoading = signal(false);

    private client = signal({
        name: '',
        cpf: '',
        phone: ''
    });

    protected clientForm = form(this.client, schemaPath => {
        disabled(schemaPath.name, () => this.isLoading());
        required(schemaPath.name, {message: 'app.pages.clients.validation.name_required'});

        disabled(schemaPath.cpf, () => this.isLoading());
        required(schemaPath.cpf, {message: 'app.pages.clients.validation.cpf_required'});

        disabled(schemaPath.phone, () => this.isLoading());
        required(schemaPath.phone, {message: 'app.pages.clients.validation.phone_required'});
    });

    protected submit(event: Event) {
        event.preventDefault();
        this.isLoading.set(true);

        this.clientService.create(this.client())
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => this.router.navigate(['/client']),
                error: (error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.Conflict) {
                        return this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('app.common.summary.error'),
                            detail: this.translateService.instant('app.common.errors.conflict')
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
