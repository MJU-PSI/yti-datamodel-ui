// import { IAttributes, IDirectiveFactory, IScope } from 'angular';
// import { EditableForm } from './editableEntityController';

// export const ImplicitEditModeDirective: IDirectiveFactory = () => {
//   return {
//     require: '^form',
//     link($scope: IScope, element: JQuery, attributes: IAttributes, form: EditableForm) {
//       form.editing = true;
//     }
//   }
// };

import { Directive, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: '[implicitEditMode]'
})
export class ImplicitEditModeDirective implements OnInit {
  @Input('implicitEditMode') form: NgForm;

  ngOnInit() {
    if (this.form) {
      this.form.control.markAsDirty();
      this.form.control.markAllAsTouched();
      this.form.control.updateValueAndValidity();
    }
  }
}
