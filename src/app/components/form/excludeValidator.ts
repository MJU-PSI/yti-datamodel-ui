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

import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { Uri } from 'app/entities/uri';

@Directive({
  selector: '[excludeValidator]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: ExcludeValidatorDirective,
    multi: true
  }]
})
export class ExcludeValidatorDirective implements AsyncValidator {
  @Input('excludeValidator') excludeProvider: () => (id: Uri) => Promise<string>;

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>{
    if (this.excludeProvider) {
      const exclude = this.excludeProvider();

      return this.createExcludeValidator(exclude)(control);
    }

    return Promise.resolve(null);
  }

  private createExcludeValidator(exclude: (id: Uri) => Promise<string>): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      const id: Uri = control.value;
      return exclude(id).then(
        excludeReason => excludeReason ? { exclude: true } : null)
    };
  }
}
