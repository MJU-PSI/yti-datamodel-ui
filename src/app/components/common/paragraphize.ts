import { FilterFactory, ISCEService } from 'angular';
import { LanguageContext } from 'app/types/language';
import { Localizable } from '@mju-psi/yti-common-ui';
import { LegacyComponent } from 'app/utils/angular';

@LegacyComponent({
  bindings: {
    text: '=',
    context: '='
  },
  template: '<span ng-bind-html="$ctrl.text | translateValue:$ctrl.context | paragraphize"></span>',
})
export class ParagraphizeComponent {
  text: Localizable;
  context: LanguageContext;
}

export const ParagraphizeFilter: FilterFactory = ($sce: ISCEService) => {
  'ngInject';
  return (text: string) => {
    return applyParagraph(text);
  };
};

const paragraphRegex = new RegExp(`(.*?\n\n})`);

function applyParagraph(text: string): string {
  if (!text) {
    return text;
  } else {
    return text.replace(paragraphRegex, '<p>$1</p>');
  }
}
