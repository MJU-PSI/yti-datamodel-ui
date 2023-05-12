// import { IAttributes, IDirectiveFactory, IModelValidators, INgModelController, IScope } from 'angular';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { isValidLanguageCode } from './validators';
// import { LanguageService } from 'app/services/languageService';

// export function placeholderText(gettextCatalog: GettextCatalog) {
//   return gettextCatalog.getString('Input') + ' ' + gettextCatalog.getString('language code') + '...';
// }

// export function createValidators(): IModelValidators {
//   return { languageCode: isValidLanguageCode };
// }

// export const LanguageInputDirective: IDirectiveFactory = (languageService: LanguageService,
//                                                           gettextCatalog: GettextCatalog) => {
//   'ngInject';
//   return {
//     scope: {
//       model: '='
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: IScope, element: JQuery, attributes: IAttributes, modelController: INgModelController) {

//       if (!attributes['placeholder']) {
//         $scope.$watch(() => languageService.UILanguage, () => {
//           element.attr('placeholder', placeholderText(gettextCatalog));
//         });
//       }

//       const validators = createValidators();

//       for (const validatorName of Object.keys(validators)) {
//         modelController.$validators[validatorName] = validators[validatorName];
//       }
//     }
//   };
// };

import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { LanguageService } from 'app/services/languageService';
import { isValidLanguageCode } from './validators';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[languageInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: LanguageInputDirective,
      multi: true
    }
  ]
})
export class LanguageInputDirective implements OnInit, Validator {
  @Input('languageInput') model: any;

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService,
    private elementRef: ElementRef<HTMLInputElement>
  ) {}

  ngOnInit() {
    this.updatePlaceholderText();
    this.languageService.language$.subscribe(() => {
      this.updatePlaceholderText();
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!isValidLanguageCode(control.value)) {
      control.setErrors({ invalidLanguageCode: true });
      control.markAsTouched();
    } else {
      control.setErrors(null);
    }
    return null;
  }

  private updatePlaceholderText(): void {
    this.elementRef.nativeElement.placeholder = this.translateService.instant('Input') + ' ' + this.translateService.instant('language code') + '...';
  }
}
