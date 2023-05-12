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

import { Directive } from '@angular/core';

@Directive({
  selector: 'exclude-validator,[exclude-validator]',
})
export class ExcludeValidatorDirective {

}
