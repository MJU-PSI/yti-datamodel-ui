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
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[ignoreDirty]',
})
export class IgnoreDirtyDirective {
  constructor(private ngModel: NgModel) {
    this.ngModel.control!.markAsPristine = () => {};
    this.ngModel.control!.markAsDirty();
  }
}
