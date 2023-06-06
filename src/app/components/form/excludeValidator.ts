// import { IAttributes, IDirectiveFactory, INgModelController, IPromise, IQService, IScope } from 'angular';
// import { Uri } from 'app/entities/uri';

// interface ExcludeValidatorAttributes extends IAttributes {
//   excludeValidator: string;
// }

// export const ExcludeValidatorDirective: IDirectiveFactory = ($q: IQService) => {
//   'ngInject';
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: IScope, _element: JQuery, attributes: ExcludeValidatorAttributes, ngModel: INgModelController) {

//       $scope.$watch(attributes.excludeValidator, (excludeProvider: () => (id: Uri) => IPromise<string>) => {
//         if (excludeProvider) {
//           const exclude = excludeProvider();
//           // TODO show exclude based dynamic validation errors in the errorMessages panel
//           ngModel.$asyncValidators['exclude'] = (id: Uri) => {
//             return exclude(id).then(excludeReason => excludeReason ? $q.reject() : true);
//           };
//         } else {
//           delete ngModel.$asyncValidators['exclude'];
//         }
//       });
//     }
//   };
// };

// TODO ALES - nimam pojma če je to pravilno
import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Uri } from 'app/entities/uri';

interface ExcludeValidatorProvider {
  (): (id: Uri) => Promise<string>;
}

@Directive({
  selector: '[excludeValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ExcludeValidatorDirective,
      multi: true
    }
  ]
})
export class ExcludeValidatorDirective implements AsyncValidator {
  @Input('excludeValidator') excludeValidator: ExcludeValidatorProvider;

  validate(control: AbstractControl): Observable<{ [key: string]: any } | null> {
    if (this.excludeValidator) {
      const exclude = this.excludeValidator();
      return of(exclude(control.value).then(excludeReason => excludeReason ? Promise.reject() : true));
    }
    return of(null);
  }
}
