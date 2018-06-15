import { IAttributes, IScope } from 'angular';
import { ClassViewController } from './classView';
import { AddPropertiesFromClassModal } from './addPropertiesFromClassModal';
import { Uri } from 'app/entities/uri';
import { ClassService } from 'app/services/classService';
import { module as mod } from './module';
import { isDefined } from 'yti-common-ui/utils/object';
import { SearchPredicateModal } from './searchPredicateModal';
import { EditableForm } from 'app/components/form/editableEntityController';
import { Option } from 'app/components/common/buttonWithOptions';
import { SearchClassModal, noExclude } from './searchClassModal';
import { SessionService } from 'app/services/sessionService';
import { LanguageService } from 'app/services/languageService';
import { Localizer } from 'app/types/language';
import { comparingLocalizable } from 'app/utils/comparator';
import { Class, Property, ClassListItem } from 'app/entities/class';
import { Model } from 'app/entities/model';
import { modalCancelHandler } from 'app/utils/angular';
import { labelNameToResourceIdName } from 'app/utils/resource';
import { Localizable } from 'yti-common-ui/types/localization';

mod.directive('classForm', () => {
  return {
    scope: {
      id: '=',
      class: '=',
      oldClass: '=',
      model: '=',
      openPropertyId: '='
    },
    restrict: 'E',
    template: require('./classForm.html'),
    require: ['classForm', '?^classView', '?^form'],
    controllerAs: 'ctrl',
    bindToController: true,
    link(_$scope: IScope,
         _element: JQuery,
         _attributes: IAttributes,
         [classFormController, classViewController, formController]: [ClassFormController, ClassViewController, EditableForm]) {
      classFormController.isEditing = () => formController && formController.editing;
      classFormController.shouldAutofocus = !isDefined(classViewController);
    },
    controller: ClassFormController
  };
});

export class ClassFormController {

  class: Class;
  properties: Property[];
  oldClass: Class;
  model: Model;
  isEditing: () => boolean;
  openPropertyId: string;
  shouldAutofocus: boolean;
  addPropertyActions: Option[];
  localizer: Localizer;

  onPropertyReorder = (property: Property, index: number) => property.index = index;
  superClassExclude = (klass: ClassListItem) => klass.isOfType('shape') ? 'Super cannot be shape' : null;

  /* @ngInject */
  constructor($scope: IScope,
              private classService: ClassService,
              private sessionService: SessionService,
              private languageService: LanguageService,
              private searchPredicateModal: SearchPredicateModal,
              private searchClassModal: SearchClassModal,
              private addPropertiesFromClassModal: AddPropertiesFromClassModal) {

    const setProperties = () => {
      if (this.isEditing() || !this.sortAlphabetically) {
        this.properties = this.class.properties;
      } else {
        this.properties = this.class.properties.slice();
        this.properties.sort(comparingLocalizable<Property>(languageService.createLocalizer(this.model), property => property.label));
      }
    };

    $scope.$watchGroup([
      () => this.class,
      () => languageService.getModelLanguage(this.model),
      () => this.sortAlphabetically,
      () => this.isEditing()
    ],
      () => setProperties());

    this.addPropertyActions = [
      {
        name: 'Add property',
        apply: () => this.addProperty()
      },
      {
        name: 'Copy properties from class',
        apply: () => this.copyPropertiesFromClass()
      }
    ];
  }

  get sortAlphabetically() {
    return this.sessionService.sortAlphabetically || false;
  }

  set sortAlphabetically(value: boolean) {
    this.sessionService.sortAlphabetically = value;
  }

  addProperty() {
    this.searchPredicateModal.openAddProperty(this.model, this.class)
      .then(property => {
        this.class.addProperty(property);
        this.openPropertyId = property.internalId.uuid;
      }, modalCancelHandler);
  }

  copyPropertiesFromClass() {
    this.searchClassModal.openWithOnlySelection(this.model, false, noExclude, _klass => 'Copy properties')
      .then(selectedClass => this.addPropertiesFromClass(selectedClass, 'class'), modalCancelHandler);
  }

  addPropertiesFromClass(klass: Class, classType: string) {
    if (klass && klass.properties.length > 0) {

      const existingPredicates = new Set<string>(this.class.properties.map(property => property.predicateId.uri));
      const exclude = (property: Property) => existingPredicates.has(property.predicateId.uri);

      this.addPropertiesFromClassModal.open(klass, classType, this.model, exclude)
        .then(properties => properties.forEach((property: Property) => this.class.addProperty(property)));
    }
  }

  addPropertiesFromClassId(id: Uri, classType: string) {
    this.classService.getInternalOrExternalClass(id, this.model)
      .then(klass => this.addPropertiesFromClass(klass, classType));
  }

  linkToIdClass() {
    return this.model.linkToResource(this.class.id);
  }

  linkToSuperclass() {
    return this.model.linkToResource(this.class.subClassOf);
  }

  linkToScopeclass() {
    return this.model.linkToResource(this.class.scopeClass);
  }

  formLabelNameToIdName(label: Localizable) {
    return labelNameToResourceIdName(this.languageService.translate(label));
  }
}
