import { Pipe, PipeTransform } from '@angular/core';

import { Localizable } from '@mju-psi/yti-common-ui';
import { LanguageService } from 'app/services/languageService';
import { LanguageContext } from 'app/types/language';

@Pipe({
  name: 'translateValue'
})
export class TranslateValuePipe implements PipeTransform {

  constructor(private languageService: LanguageService) {}

  transform(input: Localizable, context?: LanguageContext): string {
    return input ? this.languageService.translate(input, context) : '';
  }
}
