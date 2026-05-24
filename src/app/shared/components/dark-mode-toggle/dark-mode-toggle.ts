import {Component, OnInit, inject, signal} from '@angular/core';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {form, FormField} from '@angular/forms/signals';
import {PreferenceService} from '../../../services/preference-service';

@Component({
    selector: 'app-dark-mode-toggle',
    imports: [ToggleSwitchModule, FormField],
    templateUrl: './dark-mode-toggle.html'
})
export class DarkModeToggle implements OnInit {

    private preferenceService = inject(PreferenceService);

    private preferences = signal({
        darkMode: this.preferenceService.getDarkMode()
    });

    protected preferencesForm = form(this.preferences, () => {});

    ngOnInit() {
        this.applyDarkMode(this.preferences().darkMode);
    }

    protected toggleDarkMode(enabled: boolean) {
        this.preferences.set({darkMode: enabled});
        this.preferenceService.setDarkMode(enabled);
        this.applyDarkMode(enabled);
    }

    private applyDarkMode(enabled: boolean) {
        document.documentElement.classList.toggle('app-dark', enabled);
    }
}
