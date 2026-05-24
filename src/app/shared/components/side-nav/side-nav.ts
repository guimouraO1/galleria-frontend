import {Component, EventEmitter, Output} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
    selector: 'app-side-nav',
    imports: [RouterLink, RouterLinkActive, TranslateModule],
    templateUrl: './side-nav.html'
})
export class SideNav {

    @Output() navigate = new EventEmitter<void>();
}
