import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule],
    templateUrl: './app.html',
    providers: [MessageService]
})
export class App {
    protected readonly title = signal('galleria-frontend');
}
