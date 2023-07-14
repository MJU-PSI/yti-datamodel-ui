// import { IAsyncModelValidators, IAttributes, IDirectiveFactory, INgModelController, IQService, IScope } from 'angular';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { ReferenceDataService } from 'app/services/referenceDataService';
// import { LanguageService } from 'app/services/languageService';
// import { anyMatching } from '@mju-psi/yti-common-ui';
// import { ReferenceData } from 'app/entities/referenceData';

// export function placeholderText(gettextCatalog: GettextCatalog) {
//   return gettextCatalog.getString('Write reference data code');
// }

// export function createAsyncValidators($q: IQService, referenceData: ReferenceData[], referenceDataService: ReferenceDataService): IAsyncModelValidators {

//   const hasExternalReferenceData = anyMatching(referenceData, rd => rd.isExternal());

//   return {
//     codeValue(codeValue: string) {

//       if (referenceData.length === 0 || hasExternalReferenceData || !codeValue) {
//         return $q.resolve();
//       } else {
//         return referenceDataService.getReferenceDataCodes(referenceData).then(values => {
//           for (const value of values) {
//             if (value.identifier === codeValue) {
//               return true;
//             }
//           }
//           return $q.reject('does not match');
//         });
//       }
//     }
//   };
// }

// interface CodeValueInputScope extends IScope {
//   referenceData: ReferenceData[];
// }

// export const CodeValueInputDirective: IDirectiveFactory = ($q: IQService,
//                                                            referenceDataService: ReferenceDataService,
//                                                            languageService: LanguageService,
//                                                            gettextCatalog: GettextCatalog) => {
//   'ngInject';
//   return {
//     scope: {
//       referenceData: '='
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: CodeValueInputScope, element: JQuery, attributes: IAttributes, modelController: INgModelController) {

//       if (!attributes['placeholder']) {
//         $scope.$watch(() => languageService.UILanguage, () => {
//           element.attr('placeholder', placeholderText(gettextCatalog));
//         });
//       }

//       $scope.$watch(() => $scope.referenceData, referenceData => {
//         Object.assign(modelController.$asyncValidators, createAsyncValidators($q, referenceData, referenceDataService));
//       });
//     }
//   }
// };


import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors, Validator, AsyncValidatorFn } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReferenceDataService } from 'app/services/referenceDataService';
import { LanguageService } from 'app/services/languageService';
import { anyMatching } from '@mju-psi/yti-common-ui';
import { ReferenceData } from 'app/entities/referenceData';
import { TranslateService } from '@ngx-translate/core'

export function placeholderText(translateService: TranslateService): string {
  return translateService.instant('Write reference data code');
}

export function createAsyncValidators(referenceData: ReferenceData[], referenceDataService: ReferenceDataService): AsyncValidatorFn {
  const hasExternalReferenceData = anyMatching(referenceData, rd => rd.isExternal());

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (referenceData.length === 0 || hasExternalReferenceData || !control.value) {
      return new Observable<null>(observer => {
        observer.next(null);
        observer.complete();
      });
    } else {
      return from(referenceDataService.getReferenceDataCodes(referenceData)).pipe(
        map(values => {
          for (const value of values) {
            if (value.identifier === control.value) {
              return null;
            }
          }
          return { 'does not match': true };
        })
      );
    }
  };
}
@Directive({
  selector: '[codeValueInput]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: CodeValueInputDirective,
      multi: true
    }
  ]
})
export class CodeValueInputDirective implements Validator {
  @Input() referenceData: ReferenceData[];

  constructor(
    private referenceDataService: ReferenceDataService,
    private languageService: LanguageService,
    private translateService: TranslateService,
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return from(createAsyncValidators(this.referenceData, this.referenceDataService)(control));
  }

  registerOnValidatorChange(fn: () => void): void {
    this.languageService.language$.subscribe(() => fn());
  }

  getPlaceholder(): string {
    return placeholderText(this.translateService);
  }
}
