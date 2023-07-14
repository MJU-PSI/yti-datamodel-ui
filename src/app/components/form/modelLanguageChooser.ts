// import { IScope } from 'angular';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { LanguageService } from 'app/services/languageService';
// import { isLocalizationDefined } from 'app/utils/language';
// import { Language, LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';
// import { availableLanguages } from '@mju-psi/yti-common-ui';

// @LegacyComponent({
//   bindings: {
//     context: '<'
//   },
//   template: require('./modelLanguageChooser.html')
// })
// export class ModelLanguageChooserComponent {

//   context: LanguageContext;

//   constructor(private $scope: IScope,
//               private languageService: LanguageService,
//               private gettextCatalog: GettextCatalog) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watchCollection(() => this.context && this.context.language, languages => {
//       if (languages && languages.indexOf(this.languageService.getModelLanguage(this.context)) === -1) {
//         this.languageService.setModelLanguage(this.context, this.context.language[0]);
//       }
//     });

//     this.$scope.$watch(() => this.languageService.UILanguage, (language, previousLanguage) => {
//       if (language !== previousLanguage) {
//         if (this.context && this.context.language.indexOf(language) !== -1) {
//           this.languageService.setModelLanguage(this.context, language);
//         }
//       }
//     });
//   }

//   localizeLanguageName(language: Language) {
//     return this.gettextCatalog.getString('data language') + ': ' + language.toUpperCase();
// /*
//     const lang = availableLanguages.find((obj) => {
//       return obj.code === language;
//     });
//     if (lang) {
//       return this.gettextCatalog.getString('data language') + ': ' + lang.name;
//     } else {
//       const key = 'data ' + language;
//       const localization = this.gettextCatalog.getString(key);

//       if (isLocalizationDefined(key, localization)) {
//         return localization;
//       } else {
//         return this.gettextCatalog.getString('data language') + ': ' + language;
//       }
//     }
//      */
//   }

//   get language(): Language {
//     return this.languageService.getModelLanguage(this.context);
//   }

//   set language(language: Language) {
//     this.languageService.setModelLanguage(this.context, language);
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from 'app/services/languageService';
import { Language, LanguageContext } from 'app/types/language';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'model-language-chooser',
  templateUrl: './modelLanguageChooser.html'
})
export class ModelLanguageChooserComponent implements OnInit {
  @Input() context: LanguageContext;
  languages: Language[];
  modelLanguage: Language;

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    if (
      this.context &&
      this.context.language &&
      !this.context.language.includes(
        this.languageService.getModelLanguage(this.context)
      )
    ) {
      this.languageService.setModelLanguage(
        this.context,
        this.context.language[0]
      );
    }

    this.languageService.language$.subscribe((language) => {
      if (
        this.context &&
        this.context.language.includes(language) &&
        this.languageService.getModelLanguage(this.context) !== language
      ) {
        this.languageService.setModelLanguage(this.context, language);
      }
    });
  }

  localizeLanguageName(language: Language) {
    return this.translateService.instant('data language') + ': ' + language.toUpperCase();
  }

  get language(): Language {
    return this.languageService.getModelLanguage(this.context);
  }

  set language(language: Language) {
    this.languageService.setModelLanguage(this.context, language);
  }
}

