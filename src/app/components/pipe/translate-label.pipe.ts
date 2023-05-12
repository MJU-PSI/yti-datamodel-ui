import { Pipe, PipeTransform } from '@angular/core';

import { Localizable } from '@mju-psi/yti-common-ui';

import { LanguageContext } from 'app/types/language';
import { TranslateValuePipe } from './translate-value.pipe';

@Pipe({
  name: 'translateLabel'
})
export class TranslateLabelPipe implements PipeTransform {
  constructor(private translateValuePipe: TranslateValuePipe) {}

  transform(input: { label: Localizable }, context?: LanguageContext): string {
    return input ? this.translateValuePipe.transform(input.label, context) : '';
  }
}
