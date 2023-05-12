// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';

// export const IgnoreDirtyDirective: IDirectiveFactory = () => {
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link(_$scope: IScope, _element: JQuery, _attributes: IAttributes, modelController: INgModelController) {
//       modelController.$setPristine = () => {};
//       modelController.$pristine = false;
//     }
//   };
// };

import { Directive } from '@angular/core';

@Directive({
  selector: 'ignore-dirty,[ignore-dirty]',
})
export class IgnoreDirtyDirective {

}
