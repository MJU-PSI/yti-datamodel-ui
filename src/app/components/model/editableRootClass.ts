import { IAttributes, IScope } from 'angular';
import { EditableForm } from 'app/components/form/editableEntityController';
import { SearchClassModal } from 'app/components/editor/searchClassModal';
import { requireDefined } from 'yti-common-ui/utils/object';
import { Model } from 'app/entities/model';
import { ClassListItem } from 'app/entities/class';
import { module as mod } from './module';
import { modalCancelHandler } from 'app/utils/angular';

mod.directive('editableRootClass', () => {
  return {
    scope: {
      model: '='
    },
    restrict: 'E',
    template: require('./editableRootClass.html'),
    controllerAs: 'ctrl',
    bindToController: true,
    require: ['editableRootClass', '?^form'],
    link(_$scope: IScope, _element: JQuery, _attributes: IAttributes, [thisController, formController]: [EditableRootClassController, EditableForm]) {
      thisController.isEditing = () => formController.editing;
    },
    controller: EditableRootClassController
  };
});

class EditableRootClassController {

  model: Model;
  isEditing: () => boolean;

  /* @ngInject */
  constructor(private searchClassModal: SearchClassModal) {
  }

  get href() {
    return this.model.linkToResource(this.model.rootClass);
  }

  selectClass() {

    const exclude = (klass: ClassListItem) => {
      if (requireDefined(klass.definedBy).id.notEquals(this.model.id)) {
        return 'Can be selected only from this ' + this.model.normalizedType;
      } else {
        return null;
      }
    };

    this.searchClassModal.openWithOnlySelection(this.model, true, exclude)
      .then(klass => this.model.rootClass = klass.id, modalCancelHandler);
  }

  removeClass() {
    this.model.rootClass = null;
  }
}
