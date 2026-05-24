import {Component, OnInit, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ClientService} from '../../../../services/client-service';
import {Client} from '../../../../shared/interfaces/client.interface';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {SkeletonModule} from 'primeng/skeleton';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-clients',
    imports: [TranslateModule, RouterLink, ButtonModule, TableModule, SkeletonModule],
    templateUrl: './clients.html'
})
export class Clients implements OnInit {

    private clientService = inject(ClientService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private translateService = inject(TranslateService);

    protected clients = signal<Client[]>([]);
    protected isLoading = signal(true);
    protected hasNext = signal(false);
    protected hasPrevious = computed(() => this.cursorHistory().length > 0);

    private readonly pageSize = 10;
    private currentCursor = signal<string | null>(null);
    private nextCursor = signal<string | null>(null);
    private cursorHistory = signal<(string | null)[]>([]);

    ngOnInit() {
        this.load();
    }

    protected nextPage() {
        const cursor = this.nextCursor();

        if (!cursor) {
            return;
        }

        this.cursorHistory.update(history => [...history, this.currentCursor()]);
        this.load(cursor);
    }

    protected previousPage() {
        const history = this.cursorHistory();
        const cursor = history[history.length - 1] ?? null;

        this.cursorHistory.set(history.slice(0, -1));
        this.load(cursor);
    }

    private load(cursor: string | null = null) {
        this.isLoading.set(true);

        this.clientService.list(cursor, this.pageSize)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.clients.set(response.items);
                    this.currentCursor.set(cursor);
                    this.nextCursor.set(response.nextCursor);
                    this.hasNext.set(response.hasNext);
                },
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

    protected delete(id: number) {
        this.confirmationService.confirm({
            header: this.translateService.instant('app.common.confirm.delete_title'),
            message: this.translateService.instant('app.common.confirm.delete_message'),
            acceptLabel: this.translateService.instant('app.common.actions.delete'),
            rejectLabel: this.translateService.instant('app.common.actions.cancel'),
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.clientService.delete(id)
                    .pipe(untilDestroyed(this))
                    .subscribe({
                        next: () => this.clients.update(clients => clients.filter(client => client.id !== id)),
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
                    });
            }
        });
    }
}
