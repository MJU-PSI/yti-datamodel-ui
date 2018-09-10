import { EditableForm } from 'app/components/form/editableEntityController';
import { isDefined } from 'yti-common-ui/utils/object';
import { ComponentDeclaration } from 'app/utils/angular';
import { forwardRef } from '@angular/core';

export const ModalTemplateComponent: ComponentDeclaration = {
  selector: 'modalTemplate',
  bindings: {
    default: '@',
    editing: '@',
    purpose: '@'
  },
  require: {
    form: '?^form'
  },
  transclude: {
    title: 'modalTitle',
    body: 'modalBody',
    buttons: '?modalButtons'
  },
  template: require('./modalTemplate.html'),
  controller: forwardRef(() => ModalTemplateController)
};

class ModalTemplateController {

  default: string;
  editing: string;
  purpose: string;

  form: EditableForm;

  constructor() {
  }

  $postLink() {
    if (this.form && this.editing === 'true') {
      this.form.editing = true;
    }
  }

  get defaultButtons(): boolean {
    return this.default === 'true';
  }

  get headerClass() {
    return 'modal-header-' + (isDefined(this.purpose) ? this.purpose : 'normal');
  }
}
