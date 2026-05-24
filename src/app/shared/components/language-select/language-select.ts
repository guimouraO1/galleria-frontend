import {Component, OnInit, inject, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {LanguageOption} from '../../interfaces/language.interface';
import {PreferenceService} from '../../../services/preference-service';

@Component({
    selector: 'app-language-select',
    imports: [ButtonModule],
    templateUrl: './language-select.html'
})
export class LanguageSelect implements OnInit {

    private translateService = inject(TranslateService);
    private preferenceService = inject(PreferenceService);

    protected languages: LanguageOption[] = [
        {label: 'PT', value: 'pt-br', icon: 'pi pi-globe'},
        {label: 'EN', value: 'en-us', icon: 'pi pi-language'}
    ];

    protected language = signal(this.preferenceService.getLanguage());

    ngOnInit() {
        this.translateService.use(this.language());
    }

    protected changeLanguage(language: string) {
        this.language.set(language);
        this.preferenceService.setLanguage(language);
        this.translateService.use(language);
    }

    protected isSelected(language: string) {
        return this.language() === language;
    }
}
