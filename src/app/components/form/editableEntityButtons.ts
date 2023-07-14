// import { EditableEntityController, EditableForm } from './editableEntityController';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     ctrl: '=editableController',
//     context: '=',
//     idPrefix: '<'
//   },
//   require: {
//     form: '^form'
//   },
//   transclude: true,
//   template: require('./editableEntityButtons.html')
// })
// export class EditableEntityButtonsComponent {

//   ctrl: EditableEntityController<any>;
//   form: EditableForm;
//   idPrefix?: string;

//   id(button: string): string | undefined {
//     return this.idPrefix ? this.idPrefix + button : undefined;
//   }
// }
import { Component, Input } from '@angular/core';
import { EditableEntityController, EditableForm } from './editableEntityController';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'editable-entity-buttons',
  templateUrl: './editableEntityButtons.html'
})
export class EditableEntityButtonsComponent {
  @Input() editableController: EditableEntityController<any>;
  @Input() context: any;
  @Input() idPrefix?: string;
  @Input() form: NgForm;

  id(button: string): string | undefined {
    return this.idPrefix ? this.idPrefix + button : undefined;
  }
}
