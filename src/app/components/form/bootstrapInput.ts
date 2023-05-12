// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';

// export const BootstrapInputDirective: IDirectiveFactory = () => {
//   return {
//     restrict: 'E',
//     require: '?ngModel',
//     link($scope: IScope, element: JQuery, _attributes: IAttributes, modelController: INgModelController) {

//       function setClasses(invalid: boolean) {
//         if ((modelController.$dirty || modelController.$viewValue) && invalid) {
//           element.addClass('is-invalid');
//         } else {
//           element.removeClass('is-invalid');
//         }
//       }

//       if (modelController) {
//         $scope.$watch(() => modelController.$invalid, setClasses);
//         $scope.$watch(() => modelController.$dirty, () => setClasses(modelController.$invalid));
//       }
//     }
//   };
// };

import { Directive, ElementRef, HostBinding, Input, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[bootstrapInput]',
})
export class BootstrapInputDirective {

  @Input() invalidClass = 'is-invalid';

  @HostBinding('class')
  elementClass = 'form-control';

  constructor(
    private elementRef: ElementRef,
    @Optional() private ngModel: NgModel,
  ) {
    if (this.ngModel) {
      this.ngModel.statusChanges?.subscribe(() => this.setClasses());
    }
  }

  setClasses(): void {
    const invalid = this.ngModel.invalid;
    if ((this.ngModel.dirty || this.ngModel.touched || this.ngModel.value) && invalid) {
      this.elementRef.nativeElement.classList.add(this.invalidClass);
    } else {
      this.elementRef.nativeElement.classList.remove(this.invalidClass);
    }
  }
}

