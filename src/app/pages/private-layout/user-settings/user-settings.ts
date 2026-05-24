import {Component, inject, signal} from '@angular/core';
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
import {disabled, form, required, FormField} from '@angular/forms/signals';
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
export class UserSettings {

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

        disabled(schemaPath.login, () => true);

        disabled(schemaPath.password, () => this.isLoading());
    });

    protected submit(event: Event) {
        event.preventDefault();
        this.isLoading.set(true);

        this.userService.update(this.user().id, this.user().name, this.user().password)
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
