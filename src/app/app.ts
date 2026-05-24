import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
    templateUrl: './app.html',
    providers: [MessageService, ConfirmationService]
})
export class App {
    protected readonly title = signal('galleria-frontend');
}
