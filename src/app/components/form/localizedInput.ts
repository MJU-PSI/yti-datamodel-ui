// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';
// import { LanguageService } from 'app/services/languageService';
// import { isValidLabelLength, isValidModelLabelLength, isValidString } from './validators';
// import { allLocalizations, hasLocalization } from 'app/utils/language';
// import { LanguageContext } from 'app/types/language';
// import { Localizable } from '@mju-psi/yti-common-ui';

// interface LocalizedInputAttributes extends IAttributes {
//   localizedInput: 'required' | 'label' | 'modelLabel' | 'free';
// }

// interface LocalizedInputScope extends IScope {
//   context: LanguageContext;
// }

// export const LocalizedInputDirective: IDirectiveFactory = (languageService: LanguageService) => {
//   'ngInject';
//   return {
//     restrict: 'A',
//     scope: {
//       context: '='
//     },
//     require: 'ngModel',
//     link($scope: LocalizedInputScope, element: JQuery, attributes: LocalizedInputAttributes, ngModel: INgModelController) {
//       let localized: Localizable;

//       function setPlaceholder() {
//         element.attr('placeholder', languageService.translate(localized, $scope.context));
//       }

//       function removePlaceholder() {
//         element.removeAttr('placeholder');
//       }

//       $scope.$watch(() => languageService.getModelLanguage($scope.context), lang => {
//         const val = localized[lang];
//         if (!val) {
//           setPlaceholder();
//         }
//         element.val(val);
//       });

//       ngModel.$parsers.push(viewValue => {
//         localized = Object.assign(localized, {
//           [languageService.getModelLanguage($scope.context)]: viewValue
//         });
//         if (viewValue) {
//           removePlaceholder();
//         } else {
//           setPlaceholder();
//         }
//         return localized;
//       });

//       ngModel.$formatters.push(modelValue => {
//         localized = modelValue || {};
//         const val = localized[languageService.getModelLanguage($scope.context)];
//         if (!val) {
//           setPlaceholder();
//         }
//         return val;
//       });

//       if (attributes.localizedInput !== 'free') {
//         ngModel.$validators['string'] = modelValue => allLocalizations(isValidString, modelValue);
//       }

//       switch (attributes.localizedInput) {
//         case 'required':
//           ngModel.$validators['requiredLocalized'] = hasLocalization;
//           break;
//         case 'label':
//           ngModel.$validators['requiredLocalized'] = hasLocalization;
//           ngModel.$validators['length'] = modelValue => allLocalizations(isValidLabelLength, modelValue);
//           break;
//         case 'modelLabel':
//           ngModel.$validators['requiredLocalized'] = hasLocalization;
//           ngModel.$validators['length'] = modelValue => allLocalizations(isValidModelLabelLength, modelValue);
//           break;
//       }
//     }
//   };
// };

import { Directive, ElementRef, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { LanguageService } from 'app/services/languageService';
import { isValidLabelLength, isValidModelLabelLength, isValidString } from './validators';
import { allLocalizations, hasLocalization } from 'app/utils/language';
import { LanguageContext } from 'app/types/language';
import { Localizable } from '@mju-psi/yti-common-ui';

@Directive({
  selector: '[localizedInput]',
  providers: [LanguageService],
})
export class LocalizedInputDirective {
  @Input() context: LanguageContext;
  private localized: Localizable;
  element: any;

  constructor(private languageService: LanguageService,
              private elementRef: ElementRef,
              private ngModel: NgModel) {

    this.element = this.elementRef.nativeElement;
  }



  private setPlaceholder(): void {
    this.element.setAttribute(
      'placeholder',
      this.languageService.translate(this.localized, this.context)
    );
  }

  private removePlaceholder(): void {
    this.element.removeAttribute('placeholder');
  }

  private setElementValue(val: string): void {
    this.element.value = val;
  }

  private updateElementValue(): void {
    const lang = this.languageService.getModelLanguage(this.context);
    const val = this.localized[lang];
    if (!val) {
      this.setPlaceholder();
    }
    this.setElementValue(val);
  }

  private updateLocalizedModel(viewValue: string): void {
    const lang = this.languageService.getModelLanguage(this.context);
    this.localized = Object.assign(this.localized, { [lang]: viewValue });
    if (viewValue) {
      this.removePlaceholder();
    } else {
      this.setPlaceholder();
    }
  }

  private formatModelValue(modelValue: Localizable): string {
    this.localized = modelValue || {};
    const lang = this.languageService.getModelLanguage(this.context);
    const val = this.localized[lang];
    if (!val) {
      this.setPlaceholder();
    }
    return val;
  }

  private validateString(modelValue: Localizable): boolean {
    return allLocalizations(isValidString, modelValue);
  }

  private validateRequiredLocalized(modelValue: Localizable): boolean {
    return hasLocalization(modelValue);
  }

  private validateLabelLength(modelValue: Localizable): boolean {
    return allLocalizations(isValidLabelLength, modelValue);
  }

  private validateModelLabelLength(modelValue: Localizable): boolean {
    return allLocalizations(isValidModelLabelLength, modelValue);
  }

  private setValidators(attributes: string): void {
    switch (attributes) {
      case 'required':
        this.ngModel.control.setValidators(this.validateRequiredLocalized.bind(this));
        break;
      case 'label':
        this.ngModel.control.setValidators([
          this.validateRequiredLocalized.bind(this),
          this.validateLabelLength.bind(this),
        ]);
        break;
      case 'modelLabel':
        this.ngModel.control.setValidators([
          this.validateRequiredLocalized.bind(this),
          this.validateModelLabelLength.bind(this),
        ]);
        break;
      default:
        this.ngModel.control.setValidators(this.validateString.bind(this));
        break;
    }
  }

  // private initialize(): void {
  //   this.ngModel.valueChanges.subscribe((viewValue) => {
  //     this.updateLocalizedModel(viewValue);
  //   });

  //   this.ngModel.formatter = (modelValue: Localizable): string => {
  //     return this.formatModelValue(modelValue);
  //   };

  //   this.updateElementValue();
  //   this.setValidators(attributes.localizedInput);

  // }
}
