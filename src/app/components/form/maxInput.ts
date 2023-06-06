// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';
// import { isDefined } from '@mju-psi/yti-common-ui';

// interface MaxInputScope extends IScope {
//   min: number;
// }

// export const MaxInputDirective: IDirectiveFactory = () => {
//   return {
//     scope: {
//       min: '='
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: MaxInputScope, _element: JQuery, _attributes: IAttributes, modelController: INgModelController) {

//       $scope.$watch(() => $scope.min, () => modelController.$validate());

//       modelController.$validators['negative'] = (value: number) => {
//         return !isDefined(value) || value >= 0;
//       };
//       modelController.$validators['lessThanMin'] = (value: number) => {
//         return !isDefined(value) || !isDefined($scope.min) || value >= $scope.min;
//       };
//     }
//   };
// };

import { Directive, Input } from '@angular/core';
import { NgModel, NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { isDefined } from '@mju-psi/yti-common-ui';

@Directive({
  selector: '[maxInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxInputDirective,
      multi: true
    }
  ]
})
export class MaxInputDirective implements Validator {
  @Input() min: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value as number;

    if (!isDefined(value) || value >= 0) {
      // Value is not negative
      control.setErrors(null);
    } else {
      control.setErrors({ negative: true });
    }

    if (!isDefined(value) || !isDefined(this.min) || value >= this.min) {
      // Value is greater than or equal to the minimum
      control.setErrors(null);
    } else {
      control.setErrors({ lessThanMin: true });
    }

    return null;
  }
}
