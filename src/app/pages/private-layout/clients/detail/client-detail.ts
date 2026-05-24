import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {Component, OnInit, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {MessageService} from 'primeng/api';
import {ClientService} from '../../../../services/client-service';
import {Client} from '../../../../shared/interfaces/client.interface';

@UntilDestroy()
@Component({
    selector: 'app-client-detail',
    imports: [RouterLink, TranslateModule, ButtonModule, CardModule],
    templateUrl: './client-detail.html'
})
export class ClientDetail implements OnInit {

    private route = inject(ActivatedRoute);
    private clientService = inject(ClientService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected client = signal<Client | null>(null);
    protected isLoading = signal(true);

    private id = Number(this.route.snapshot.paramMap.get('id'));

    ngOnInit() {
        this.clientService.get(this.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: client => this.client.set(client),
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
