import {Component, OnInit, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {MessageModule} from 'primeng/message';
import {UserService} from '../../../services/user-service';
import {disabled, form, maxLength, minLength, pattern, required, FormField} from '@angular/forms/signals';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {TokenService} from '../../../services/token-service';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-user-settings',
    imports: [TranslateModule, ButtonModule, CardModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TableModule, MessageModule, FormField],
    templateUrl: './user-settings.html'
})
export class UserSettings implements OnInit {

    private userService = inject(UserService);
    private router = inject(Router);
    private tokenService = inject(TokenService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected isLoading = signal(false);

    private user = signal({
        id: 0,
        name: '',
        login: '',
        password: ''
    });

    protected userInfo = this.user.asReadonly();

    protected userForm = form(this.user, schemaPath => {
        disabled(schemaPath.name, () => this.isLoading());
        required(schemaPath.name, {message: 'app.pages.user_settings.validation.name_required'});
        minLength(schemaPath.name, 3, {message: 'app.pages.user_settings.validation.name_size'});
        maxLength(schemaPath.name, 254, {message: 'app.pages.user_settings.validation.name_size'});

        disabled(schemaPath.login, () => true);

        disabled(schemaPath.password, () => this.isLoading());
        required(schemaPath.password, {message: 'app.pages.user_settings.validation.password_required'});
        minLength(schemaPath.password, 6, {message: 'validation.passwordMin'});
        maxLength(schemaPath.password, 255, {message: 'app.pages.user_settings.validation.password_size'});
        pattern(schemaPath.password, /[A-Z]/, {message: 'validation.passwordUppercase'});
        pattern(schemaPath.password, /[a-z]/, {message: 'validation.passwordLowercase'});
        pattern(schemaPath.password, /[0-9]/, {message: 'validation.passwordNumber'});
        pattern(schemaPath.password, /[^A-Za-z0-9]/, {message: 'validation.passwordSpecial'});
    });

    ngOnInit() {
        const userId = this.tokenService.getUserId();

        if (!userId) {
            this.tokenService.clearAccessToken();
            this.router.navigate(['/login']);
            return;
        }

        this.user.update(user => ({...user, id: userId, login: this.tokenService.getLogin()}));
        this.isLoading.set(true);

        this.userService.get(userId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: user => this.user.set({...user, password: ''}),
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

        this.userService.update(this.user().id, this.user().name.trim(), this.user().password)
            .pipe(untilDestroyed(this))
            .subscribe({
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

    protected delete() {
        this.confirmationService.confirm({
            header: this.translateService.instant('app.common.confirm.delete_account_title'),
            message: this.translateService.instant('app.common.confirm.delete_account_message'),
            acceptLabel: this.translateService.instant('app.common.actions.delete'),
            rejectLabel: this.translateService.instant('app.common.actions.cancel'),
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.isLoading.set(true);

                this.userService.delete(this.user().id)
                    .pipe(untilDestroyed(this))
                    .subscribe({
                        next: () => {
                            this.tokenService.clearAccessToken();
                            this.router.navigate(['/login']);
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
        });
    }
}
