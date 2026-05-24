import {Component, inject} from '@angular/core';
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

    protected visible = false;

    protected closeDrawer() {
        this.visible = false;
    }

    protected logout() {
        this.tokenService.clearAccessToken();
        this.closeDrawer();
        this.clearPrimeOverlays();
        setTimeout(() => this.router.navigate(['/login'], {replaceUrl: true}));
    }

    private clearPrimeOverlays() {
        document.querySelectorAll('.p-drawer-mask, .p-overlay-mask, .p-component-overlay').forEach(overlay => overlay.remove());
        document.body.classList.remove('p-overflow-hidden');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
    }
}
