import {Component, inject, signal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {UserService} from '../../services/user-service';
import {disabled, form, minLength, pattern, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Router, RouterLink} from '@angular/router';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-create-user',
    imports: [CardModule, InputGroupModule, InputGroupAddonModule, InputTextModule, PasswordModule, ButtonModule, MessageModule, TranslateModule, FormField, RouterLink],
    templateUrl: './create-user.html'
})
export class CreateUser {

    private userService = inject(UserService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected isLoading = signal(false);

    private createUser = signal({
        name: '',
        login: '',
        password: ''
    });

    protected createUserForm = form(this.createUser, schemaPath => {
        disabled(schemaPath.name, () => this.isLoading());
        required(schemaPath.name, {message: 'app.pages.create_user.form.validation.required'});

        disabled(schemaPath.login, () => this.isLoading());
        required(schemaPath.login, {message: 'app.pages.create_user.form.validation.required'});

        disabled(schemaPath.password, () => this.isLoading());
        required(schemaPath.password, {message: 'app.pages.create_user.form.validation.required'});
        minLength(schemaPath.password, 6, {message: 'validation.passwordMin'});
        pattern(schemaPath.password, /[A-Z]/, {message: 'validation.passwordUppercase'});
        pattern(schemaPath.password, /[a-z]/, {message: 'validation.passwordLowercase'});
        pattern(schemaPath.password, /[0-9]/, {message: 'validation.passwordNumber'});
        pattern(schemaPath.password, /[^A-Za-z0-9]/, {message: 'validation.passwordSpecial'});
    });

    async onSubmit(event: Event) {
        event.preventDefault();

        this.isLoading.set(true);

        this.userService.createUser(this.createUser().login, this.createUser().password, this.createUser().name)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => this.router.navigate(['login']),
                error: (error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.Conflict) {
                        return this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('app.common.summary.error'),
                            detail: this.translateService.instant('app.pages.create_user.errors.conflict')
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
