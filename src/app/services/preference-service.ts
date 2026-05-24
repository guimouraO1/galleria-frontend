import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PreferenceService {

    private readonly darkModeKey = 'darkMode';
    private readonly languageKey = 'language';

    getDarkMode() {
        return localStorage.getItem(this.darkModeKey) === 'true';
    }

    setDarkMode(enabled: boolean) {
        localStorage.setItem(this.darkModeKey, String(enabled));
    }

    getLanguage() {
        return localStorage.getItem(this.languageKey) ?? 'pt-br';
    }

    setLanguage(language: string) {
        localStorage.setItem(this.languageKey, language);
    }
}
