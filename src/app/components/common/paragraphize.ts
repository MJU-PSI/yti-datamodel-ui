// import { FilterFactory, ISCEService } from 'angular';
// import { LanguageContext } from 'app/types/language';
// import { Localizable } from '@mju-psi/yti-common-ui';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     text: '=',
//     context: '='
//   },
//   template: '<span ng-bind-html="$ctrl.text | translateValue:$ctrl.context | paragraphize"></span>',
// })
// export class ParagraphizeComponent {
//   text: Localizable;
//   context: LanguageContext;
// }

// export const ParagraphizeFilter: FilterFactory = ($sce: ISCEService) => {
//   'ngInject';
//   return (text: string) => {
//     return $sce.trustAsHtml(applyParagraph(text));
//   };
// };

// const paragraphRegex = new RegExp(`(.*?\n\n})`);

// function applyParagraph(text: string): string {
//   if (!text) {
//     return text;
//   } else {
//     return text.replace(paragraphRegex, '<p>$1</p>');
//   }
// }

import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LanguageContext } from 'app/types/language';
import { Localizable } from '@mju-psi/yti-common-ui';

@Pipe({ name: 'paragraphize' })
export class ParagraphizePipe implements PipeTransform {
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(applyParagraph(value));
  }

  constructor(private sanitizer: DomSanitizer) {}
}

@Component({
  selector: 'app-paragraphize',
  template: `<span innerHTML={{text | translateValue:context | paragraphize}}></span>`,
})
export class ParagraphizeComponent {
  @Input() text: Localizable;
  @Input() context: LanguageContext;
}

const paragraphRegex = new RegExp(`(.*?\n\n})`);

function applyParagraph(text: string): string {
  if (!text) {
    return text;
  } else {
    return text.replace(paragraphRegex, '<p>$1</p>');
  }
}
