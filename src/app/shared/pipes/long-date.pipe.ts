import {Pipe, PipeTransform, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';

@Pipe({
    name: 'longDate',
    pure: false
})
export class LongDatePipe implements PipeTransform {

    private translateService = inject(TranslateService);

    transform(value: string | number | Date | null | undefined) {
        if (!value) {
            return '';
        }

        const dateTime = value instanceof Date
            ? DateTime.fromJSDate(value)
            : typeof value === 'number'
                ? DateTime.fromMillis(value)
                : DateTime.fromISO(value);

        if (!dateTime.isValid) {
            return '';
        }

        const language = this.translateService.getCurrentLang() || 'pt-br';

        if (language === 'pt-br') {
            const parts = dateTime.setLocale('pt-BR').toFormat("dd 'de' LLLL 'de' yyyy").split(' ');
            parts[2] = `${parts[2].charAt(0).toUpperCase()}${parts[2].slice(1)}`;
            return parts.join(' ');
        }

        return dateTime.setLocale('en-US').toFormat('LLLL dd, yyyy');
    }
}
