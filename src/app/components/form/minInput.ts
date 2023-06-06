// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';
// import { isDefined } from '@mju-psi/yti-common-ui';

// interface MinInputScope extends IScope {
//   max: number;
// }

// export const MinInputDirective: IDirectiveFactory = () => {
//   return {
//     scope: {
//       max: '='
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: MinInputScope, _element: JQuery, _attributes: IAttributes, modelController: INgModelController) {

//       $scope.$watch(() => $scope.max, () => modelController.$validate());

//       modelController.$validators['negative'] = (value: number) => {
//         return !isDefined(value) || value >= 0;
//       };

//       modelController.$validators['greaterThanMax'] = (value: number) => {
//         return !isDefined(value) || !isDefined($scope.max) || value <= $scope.max;
//       };
//     }
//   };
// };

import { Directive, Input } from '@angular/core';
import { NgModel, NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { isDefined } from '@mju-psi/yti-common-ui';

@Directive({
  selector: '[minInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinInputDirective,
      multi: true
    }
  ]
})
export class MinInputDirective implements Validator {
  @Input() max: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value as number;

    if (!isDefined(value) || value >= 0) {
      // Value is not negative
      control.setErrors(null);
    } else {
      control.setErrors({ negative: true });
    }

    if (!isDefined(value) || !isDefined(this.max) || value <= this.max) {
      // Value is less than or equal to the maximum
      control.setErrors(null);
    } else {
      control.setErrors({ greaterThanMax: true });
    }

    return null;
  }
}
