// import { IAttributes, IDirectiveFactory, INgModelController, IQService, IScope } from 'angular';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { resolveValidator } from './validators';
// import { LanguageService } from 'app/services/languageService';
// import { createAsyncValidators } from './codeValueInput';
// import { ReferenceDataService } from 'app/services/referenceDataService';
// import { isUpperCase } from 'change-case';
// import { DataType } from 'app/entities/dataTypes';
// import { ReferenceData } from 'app/entities/referenceData';

// export function placeholderText(dataType: DataType, gettextCatalog: GettextCatalog) {
//   const validator = resolveValidator(dataType);
//   const localization = gettextCatalog.getString(dataType);
//   const placeholder = gettextCatalog.getString('Input') + ' ' + (isUpperCase(localization) ? localization : localization.toLowerCase()) + '...';
//   return validator.format ? placeholder + ` (${validator.format})` : placeholder;
// }

// interface DatatypeInputScope extends IScope {
//   datatypeInput: DataType;
//   referenceData: ReferenceData[];
// }

// export const DataTypeInputDirective: IDirectiveFactory = ($q: IQService,
//                                                           referenceDataService: ReferenceDataService,
//                                                           languageService: LanguageService,
//                                                           gettextCatalog: GettextCatalog) => {
//   'ngInject';
//   return {
//     restrict: 'EA',
//     scope: {
//       datatypeInput: '=',
//       referenceData: '='
//     },
//     require: 'ngModel',
//     link($scope: DatatypeInputScope, element: JQuery, _attributes: IAttributes, ngModel: INgModelController) {

//       const setPlaceholder = () => element.attr('placeholder', placeholderText($scope.datatypeInput, gettextCatalog));

//       $scope.$watch(() => languageService.UILanguage, setPlaceholder);

//       function initializeDataType(dataType: DataType, oldDataType: DataType) {
//         setPlaceholder();

//         if (oldDataType) {
//           delete ngModel.$validators[oldDataType];
//           ngModel.$setValidity(oldDataType, true);
//         }

//         ngModel.$validators[dataType] = resolveValidator(dataType);
//         ngModel.$validate();
//       }

//       function initializeReferenceData(referenceData: ReferenceData[]) {
//         Object.assign(ngModel.$asyncValidators, createAsyncValidators($q, referenceData, referenceDataService));
//         ngModel.$validate();
//       }

//       $scope.$watch(() => $scope.datatypeInput, initializeDataType);
//       $scope.$watchCollection(() => $scope.referenceData, initializeReferenceData);
//     }
//   };
// };

// TODO ALES

import { resolvePlaceholder, resolveValidator } from './validators';
import { LanguageService } from 'app/services/languageService';
import { createAsyncValidators } from './codeValueInput';
import { ReferenceDataService } from 'app/services/referenceDataService';
import { isUpperCase } from 'change-case';
import { DataType } from 'app/entities/dataTypes';
import { ReferenceData } from 'app/entities/referenceData';

import { Directive, ElementRef, Input, OnChanges, Self, SimpleChanges } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export function placeholderText(dataType: DataType, translateService: TranslateService) {
  const validator = resolvePlaceholder(dataType);
  const localization = translateService.instant(dataType);
  const placeholder = translateService.instant('Input') + ' ' + (isUpperCase(localization) ? localization : localization.toLowerCase()) + '...';
  return validator.format ? placeholder + ` (${validator.format})` : placeholder;
}

@Directive({
  selector: '[datatypeInput][ngModel]'
})
export class DataTypeInputDirective implements OnChanges {
  @Input('datatypeInput') dataTypeInput: DataType;
  @Input() referenceData: ReferenceData[];

  constructor(
    private ngModel: NgModel,
    private elementRef: ElementRef,
    private languageService: LanguageService,
    private referenceDataService: ReferenceDataService,
    private translateService: TranslateService) {}

  ngOnInit() {
    this.languageService.language$.subscribe(() => {
      this.setPlaceholder();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataTypeInput) {
      this.initializeDataType(changes.dataTypeInput.currentValue, changes.dataTypeInput.previousValue);
    }

    if (changes.referenceData) {
      this.initializeReferenceData(changes.referenceData.currentValue);
    }
  }

  private initializeDataType(dataType: DataType, oldDataType: DataType): void {
    this.setPlaceholder();

    if (oldDataType) {
      delete this.ngModel.control.errors?.[oldDataType];
      this.ngModel.control.updateValueAndValidity();
    }

    this.ngModel.control.setValidators(resolveValidator(dataType));
    this.ngModel.control.updateValueAndValidity();
  }

  private initializeReferenceData(referenceData: ReferenceData[]): void {
    const asyncValidators = this.ngModel.control?.asyncValidator
    ? [this.ngModel.control.asyncValidator, createAsyncValidators(referenceData, this.referenceDataService)]
    : [createAsyncValidators(referenceData, this.referenceDataService)];
    this.ngModel.control?.setAsyncValidators(asyncValidators);

    this.ngModel.control.updateValueAndValidity();
  }

  private setPlaceholder(): void {
    const placeholder = placeholderText(this.dataTypeInput, this.translateService);
    const element = this.elementRef.nativeElement;
    if (element) {
      element.setAttribute('placeholder', placeholder);
    }
  }
}
