import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {TranslateModule} from '@ngx-translate/core';
import {DarkModeToggle} from '../../shared/components/dark-mode-toggle/dark-mode-toggle';
import {LanguageSelect} from '../../shared/components/language-select/language-select';
import {SideNav} from '../../shared/components/side-nav/side-nav';
import {TokenService} from '../../services/token-service';

@Component({
    selector: 'app-private-layout',
    imports: [RouterOutlet, ButtonModule, DrawerModule, TranslateModule, DarkModeToggle, LanguageSelect, SideNav],
    templateUrl: './private-layout.html'
})
export class PrivateLayout {

    private router = inject(Router);
    private tokenService = inject(TokenService);

    protected visible = signal(false);

    protected closeDrawer() {
        this.visible.set(false);
    }

    protected logout() {
        this.tokenService.clearAccessToken();
        this.closeDrawer();
        this.router.navigate(['/']);
    }
}
