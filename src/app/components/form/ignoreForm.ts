// import { IAttributes, IDirectiveFactory, IFormController, INgModelController, IScope } from 'angular';

// export const IgnoreFormDirective: IDirectiveFactory = () => {
//   return {
//     restrict: 'A',
//     require: ['ngModel', '^?form'],
//     link(_$scope: IScope, _element: JQuery, _attributes: IAttributes, [modelController, formController]: [INgModelController, IFormController]) {
//       if (formController) {
//         formController.$removeControl(modelController);
//       }
//     }
//   };
// };

// import { Directive, forwardRef } from '@angular/core';
// import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, NgModel } from '@angular/forms';

// @Directive({
//   selector: '[ignoreForm]',
//   providers: [
//     {
//       provide: NG_VALIDATORS,
//       useExisting: forwardRef(() => IgnoreFormDirective),
//       multi: true
//     }
//   ]
// })
// export class IgnoreFormDirective implements Validator {
//   constructor(private ngModel: NgModel) {}

//   validate(control: AbstractControl): ValidationErrors | null {
//     // Remove the NgModel directive from its parent form's controls array
//     const form = this.ngModel.formDirective?.form;
//     if (form) {
//       form.removeControl(this.ngModel);
//     }

//     return null;
//   }
// }


import { Directive, ElementRef, Input, OnInit, Optional } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';

@Directive({
  selector: '[ignoreForm]'
})
export class IgnoreFormDirective implements OnInit {

  constructor(
    @Optional() private ngModel: NgModel,
    @Optional() private ngForm: NgForm
  ) {}

  ngOnInit(): void {
    if (this.ngModel && this.ngForm) {
      this.ngForm.removeControl(this.ngModel);
    }
  }
}
