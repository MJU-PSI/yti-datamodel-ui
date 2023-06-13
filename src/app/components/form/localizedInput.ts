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


import { Directive, Input, ElementRef, HostListener, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidatorFn } from '@angular/forms';
import { Localizable } from '@mju-psi/yti-common-ui';
import { LanguageService } from 'app/services/languageService';
import { LanguageContext } from 'app/types/language';
import { isValidLabelLength, isValidModelLabelLength } from './validators';
import { hasLocalization } from 'app/utils/language';

export function requiredLocalized(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!hasLocalization(value)) {
      return { requiredLocalized: true };
    }
    return { requiredLocalized: false };
  };
}

export function length(isValidLength: (value: string) => boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const values = control.value;
    if (values === null || typeof values !== 'object') {
      return null;
    }

    for (const value of Object.values(control.value)) {
      if (!isValidLength(value as string)) {
        return { length: true };
      }
    }
    return null;
  };
}

@Directive({
  selector: '[localizedInput]',
  providers: []
})
export class LocalizedInputDirective implements ControlValueAccessor {
  @Input('localizedInput') localizedInput: string;
  @Input() context: LanguageContext;

  private validators: ValidatorFn[] = [];
  private localized: Localizable;

  private onChange: (value: any) => void;
  private onTouched: () => void;

  constructor(
    private elementRef: ElementRef,
    private languageService: LanguageService,
    @Self() private controlDirective: NgControl) {
      controlDirective.valueAccessor = this;
    }

  ngOnInit(): void {

    this.languageService.modelLanguageChange$.subscribe(() => {
      const lang = this.languageService.getModelLanguage(this.context);
      const languageValue = this.localized ? this.localized[lang] : '';

      if(languageValue === undefined) {
        this.setPlaceholder();
        this.elementRef.nativeElement.value = null;
      } else {
        this.removePlaceholder();
        this.elementRef.nativeElement.value = languageValue;
      }
    })

    // TODO ALES - preveri naslednje
//       if (attributes.localizedInput !== 'free') {
//         ngModel.$validators['string'] = modelValue => allLocalizations(isValidString, modelValue);
//       }

    switch (this.localizedInput) {
      case 'required':
        this.validators.push(requiredLocalized());
        break;
      case 'label':
        this.validators.push(requiredLocalized(), length(isValidLabelLength));
        break;
      case 'modelLabel':
        this.validators.push(requiredLocalized(), length(isValidModelLabelLength));
        break;
      default:
        // Handle other cases if needed
        break;
    }

    this.controlDirective.control?.setValidators(this.validators);
    this.controlDirective.control?.updateValueAndValidity();
  }

  writeValue(value: any): void {
    this.localized = value;

    const lang = this.languageService.getModelLanguage(this.context);
    const languageValue = this.localized ? this.localized[lang] : '';

    if(languageValue === undefined) {
      this.setPlaceholder();
      this.elementRef.nativeElement.value = null;
    } else {
      this.removePlaceholder();
      this.elementRef.nativeElement.value = languageValue;
    }

  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: any): void {
    if(this.localized) {
      const lang = this.languageService.getModelLanguage(this.context);
      this.localized[lang] = value;
    }
    this.onChange(this.localized);
  }

  setPlaceholder() {
    this.elementRef.nativeElement.setAttribute("placeholder", this.languageService.translate(this.localized, this.context));
  }

  removePlaceholder() {
    this.elementRef.nativeElement.setAttribute("placeholder", null);
  }
}
