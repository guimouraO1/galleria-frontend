import {Component, inject, signal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth-service';
import {disabled, form, maxLength, minLength, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Router, RouterLink} from '@angular/router';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {MessageService} from 'primeng/api';

@UntilDestroy()
@Component({
    selector: 'app-login',
    imports: [CardModule, InputGroupModule, InputGroupAddonModule, InputTextModule, ButtonModule, TranslateModule, FormField, RouterLink],
    templateUrl: './login.html'
})
export class Login {

    private authService = inject(AuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected isLoading = signal(false);

    private login = signal({
        login: '',
        password: ''
    });

    protected loginForm = form(this.login, schemaPath => {
        disabled(schemaPath.login, () => this.isLoading());
        required(schemaPath.login, {message: 'app.pages.login.form.validation.required'});
        minLength(schemaPath.login, 3, {message: 'app.pages.login.form.validation.username_size'});
        maxLength(schemaPath.login, 100, {message: 'app.pages.login.form.validation.username_size'});

        disabled(schemaPath.password, () => this.isLoading());
        required(schemaPath.password, {message: 'app.pages.login.form.validation.required'});
    });

    async onSubmit(event: Event) {
        event.preventDefault();

        this.isLoading.set(true);

        this.authService.login(this.login().login, this.login().password)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => this.router.navigate(['dashboard']),
                error: (error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.Unauthorized) {
                        return this.messageService
                            .add({
                                severity: 'error',
                                summary: this.translateService.instant('app.common.summary.error'),
                                detail: this.translateService.instant('app.pages.login.errors.invalid-credentials')
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
