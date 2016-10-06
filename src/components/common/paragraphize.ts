import { module as mod } from './module';
import { LanguageContext, Localizable } from '../../services/entities';
import { ISCEService, sanitize } from 'angular';
import ISanitizeService = sanitize.ISanitizeService;

mod.directive('paragraphize', () => {
  return {
    restrict: 'E',
    scope: {
      text: '=',
      context: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: ParagraphizeController,
    template: '<span ng-bind-html="ctrl.text | translateValue: ctrl.context | paragraphize"></span>'
  };
});


class ParagraphizeController {
  text: Localizable;
  context: LanguageContext;
}

mod.filter('paragraphize', /* @ngInject */ ($sce: ISCEService, $sanitize: ISanitizeService) => {
  return (text: string) => {
    console.log($sanitize(text));
    return $sce.trustAsHtml(applyParagraph($sanitize(text)));
  };
});

const sanitizedLineFeed = '&#10;';
const paragraphRegex = new RegExp(`(.*?${sanitizedLineFeed}${sanitizedLineFeed})`);

function applyParagraph(text: string): string {
  if (!text) {
    return text;
  } else {
    return text.replace(paragraphRegex, '<p>$1</p>');
  }
}
