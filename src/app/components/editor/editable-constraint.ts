// import { SearchClassModal } from './searchClassModal';
// import { SearchClassType } from 'app/types/component';
// import { combineExclusions, createClassTypeExclusion, createDefinedByExclusion, createExistsExclusion, createSelfExclusion } from 'app/utils/exclusion';
// import { collectProperties } from '@mju-psi/yti-common-ui';
// import { Class, ClassListItem, Constraint, ConstraintListItem } from 'app/entities/class';
// import { Model } from 'app/entities/model';
// import { ConstraintType } from 'app/types/entity';
// import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';
// import { EditableForm } from 'app/components/form/editableEntityController';
// import { isExternalLink } from 'app/components/form/href';

// @LegacyComponent({
//   bindings: {
//     id: '@',
//     constraint: '=',
//     model: '=',
//     class: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: require('./editableConstraint.html')
// })
// export class EditableConstraintComponent {

//   constraint: Constraint;
//   model: Model;
//   class: Class;
//   types: ConstraintType[] = ['or', 'and', 'not'];

//   form: EditableForm;

//   constructor(private searchClassModal: SearchClassModal) {
//     'ngInject';
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   linkItem(item: ConstraintListItem) {
//     return this.model.linkToResource(item.shapeId);
//   }

//   addItem() {
//     const exclude = combineExclusions<ClassListItem>(
//       createClassTypeExclusion(SearchClassType.SpecializedClass),
//       createExistsExclusion(collectProperties(this.constraint.items, item => item.shapeId.uri)),
//       createDefinedByExclusion(this.model),
//       createSelfExclusion(this.class)
//     );

//     this.searchClassModal.openWithOnlySelection(this.model, true, exclude).then(klass => this.constraint.addItem(klass), modalCancelHandler);
//   }

//   removeItem(item: ConstraintListItem) {
//     this.constraint.removeItem(item);
//   }

//   isExternalLink(link: string): boolean {
//     return isExternalLink(link);
//   }
// }

import { Component, Input } from '@angular/core';
import { SearchClassModal } from './searchClassModal';
import { SearchClassType } from 'app/types/component';
import { combineExclusions, createClassTypeExclusion, createDefinedByExclusion, createExistsExclusion, createSelfExclusion } from 'app/utils/exclusion';
import { collectProperties } from '@mju-psi/yti-common-ui';
import { Class, ClassListItem, Constraint, ConstraintListItem } from 'app/entities/class';
import { Model } from 'app/entities/model';
import { ConstraintType } from 'app/types/entity';
import { isExternalLink } from 'app/components/form/href';
import { EditableForm } from '../form/editableEntityController';
import { modalCancelHandler } from 'app/utils/angular';

@Component({
  selector: 'editable-constraint',
  templateUrl: './editable-constraint.html'
})
export class EditableConstraintComponent {

  @Input() id: string;
  @Input() constraint: Constraint;
  @Input() model: Model;
  @Input() class: Class;

  types: ConstraintType[] = ['or', 'and', 'not'];

  form: EditableForm;
  // TODO ALES - PREVERI open variablo, ker prej je ni bilo
  open: any;

  constructor(private searchClassModal: SearchClassModal) {
  }

  isEditing() {
    return this.form && this.form.editing;
  }

  linkItem(item: ConstraintListItem) {
    return this.model.linkToResource(item.shapeId);
  }

  addItem() {
    const exclude = combineExclusions<ClassListItem>(
      createClassTypeExclusion(SearchClassType.SpecializedClass),
      createExistsExclusion(collectProperties(this.constraint.items, item => item.shapeId.uri)),
      createDefinedByExclusion(this.model),
      createSelfExclusion(this.class)
    );

    // this.searchClassModal.openWithOnlySelection(this.model, true, exclude).then(klass => this.constraint.addItem(klass), modalCancelHandler);
  }

  removeItem(item: ConstraintListItem) {
    this.constraint.removeItem(item);
  }

  isExternalLink(link: string): boolean {
    return isExternalLink(link);
  }

// TODO ALES - PREVERI isOpen metodo, ker prej je ni bilo
  isOpen(): any {
    throw new Error('Method not implemented.');
  }
}

