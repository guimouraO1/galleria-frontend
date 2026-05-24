import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {ClientService} from '../../../../services/client-service';
import {disabled, form, maxLength, minLength, pattern, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-client-new',
    imports: [RouterLink, TranslateModule, ButtonModule, CardModule, InputGroupModule, InputGroupAddonModule, InputMaskModule, InputTextModule, FormField],
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
        minLength(schemaPath.name, 3, {message: 'app.pages.clients.validation.name_size'});
        maxLength(schemaPath.name, 254, {message: 'app.pages.clients.validation.name_size'});

        disabled(schemaPath.cpf, () => this.isLoading());
        required(schemaPath.cpf, {message: 'app.pages.clients.validation.cpf_required'});
        pattern(schemaPath.cpf, /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/, {message: 'app.pages.clients.validation.cpf_invalid'});

        disabled(schemaPath.phone, () => this.isLoading());
        required(schemaPath.phone, {message: 'app.pages.clients.validation.phone_required'});
        pattern(schemaPath.phone, /^(\d{10,11}|\(\d{2}\) \d{4,5}-\d{4})$/, {message: 'app.pages.clients.validation.phone_invalid'});
    });

    protected submit(event: Event) {
        event.preventDefault();

        this.isLoading.set(true);

        this.clientService.create({
            name: this.client().name.trim(),
            cpf: this.client().cpf.replace(/\D/g, ''),
            phone: this.client().phone.replace(/\D/g, '')
        })
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
