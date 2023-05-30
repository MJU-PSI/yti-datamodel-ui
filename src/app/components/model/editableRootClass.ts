// import { EditableForm } from 'app/components/form/editableEntityController';
// import { SearchClassModal } from 'app/components/editor/searchClassModal';
// import { requireDefined } from '@mju-psi/yti-common-ui';
// import { Model } from 'app/entities/model';
// import { ClassListItem } from 'app/entities/class';
// import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     model: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: require('./editableRootClass.html')
// })
// export class EditableRootClassComponent {

//   model: Model;

//   form: EditableForm;

//   constructor(private searchClassModal: SearchClassModal) {
//     'ngInject';
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   get href() {
//     return this.model.linkToResource(this.model.rootClass);
//   }

//   selectClass() {

//     const exclude = (klass: ClassListItem) => {
//       if (requireDefined(klass.definedBy).id.notEquals(this.model.id)) {
//         return 'Can be selected only from this ' + this.model.normalizedType;
//       } else {
//         return null;
//       }
//     };

//     this.searchClassModal.openWithOnlySelection(this.model, true, exclude)
//       .then(klass => this.model.rootClass = klass.id, modalCancelHandler);
//   }

//   removeClass() {
//     this.model.rootClass = null;
//   }
// }

import { Component, Input } from '@angular/core';
import { SearchClassModal } from 'app/components/editor/searchClassModal';
import { requireDefined } from '@mju-psi/yti-common-ui';
import { Model } from 'app/entities/model';
import { ClassListItem } from 'app/entities/class';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'editable-root-class',
  templateUrl: './editableRootClass.html'
})
export class EditableRootClassComponent {

  @Input() model: Model;
  @Input() form: NgForm;

  constructor(private searchClassModal: SearchClassModal) { }

  isEditing(): boolean {
    return this.form && this.form.form.editing;
  }

  get href() {
    return this.model.linkToResource(this.model.rootClass);
  }

  selectClass(): void {
    const exclude = (klass: ClassListItem): string | null => {
      if (requireDefined(klass.definedBy).id !== this.model.id) {
        return 'Can be selected only from this ' + this.model.normalizedType;
      } else {
        return null;
      }
    };
    this.searchClassModal.openWithOnlySelection(this.model, true, exclude)
      .then((klass: ClassListItem) => this.model.rootClass = klass.id)
      .catch(() => { });

  }

  removeClass(): void {
    this.model.rootClass = null;
  }
}
