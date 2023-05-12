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

import { Directive } from '@angular/core';

@Directive({
  selector: 'min-input,[min-input]',
})
export class MinInputDirective {

}
