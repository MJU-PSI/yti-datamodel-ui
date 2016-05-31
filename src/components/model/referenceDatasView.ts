import IAttributes = angular.IAttributes;
import IScope = angular.IScope;
import { ModelViewController } from './modelView';
import { Model, ReferenceData } from '../../services/entities';
import { LanguageService, Localizer } from '../../services/languageService';
import { TableDescriptor, ColumnDescriptor } from '../form/editableTable';
import { module as mod }  from './module';
import { createExistsExclusion } from '../../utils/exclusion';
import { collectIds } from '../../utils/entity';
import { SearchReferenceDataModal } from './searchReferenceDataModal';
import { EditReferenceDataModal } from './editReferenceDataModal';
import { ViewReferenceDataModal } from './viewReferenceDataModal';

mod.directive('referenceDatasView', () => {
  return {
    scope: {
      model: '='
    },
    restrict: 'E',
    template: `
      <h4>
        <span translate>Code schemes</span> 
        <button type="button" class="btn btn-link btn-xs pull-right" ng-click="ctrl.addReferenceData()" ng-show="ctrl.isEditing()">
          <span class="glyphicon glyphicon-plus"></span>
          <span translate>Add code scheme</span>
        </button>
      </h4>
      <editable-table descriptor="ctrl.descriptor" values="ctrl.model.referenceDatas" expanded="ctrl.expanded"></editable-table>
    `,
    controllerAs: 'ctrl',
    bindToController: true,
    require: ['referenceDatasView', '?^modelView'],
    link($scope: IScope, element: JQuery, attributes: IAttributes, [thisController, modelViewController]: [ReferenceDatasViewController, ModelViewController]) {
      thisController.isEditing = () => !modelViewController || modelViewController.isEditing();
    },
    controller: ReferenceDatasViewController
  };
});

class ReferenceDatasViewController {

  model: Model;
  isEditing: () => boolean;

  descriptor: ReferenceDataTableDescriptor;
  expanded: boolean;

  /* @ngInject */
  constructor($scope: IScope, private searchReferenceDataModal: SearchReferenceDataModal, editReferenceDataModal: EditReferenceDataModal, viewReferenceDataModal: ViewReferenceDataModal, languageService: LanguageService) {
    $scope.$watch(() => this.model, model => {
      this.descriptor = new ReferenceDataTableDescriptor(model, languageService.createLocalizer(model), editReferenceDataModal, viewReferenceDataModal);
    });
  }

  addReferenceData() {
    const exclude = createExistsExclusion(collectIds(this.model.referenceDatas));

    this.searchReferenceDataModal.openSelectionForModel(this.model, exclude)
      .then(referenceData => {
        this.model.addReferenceData(referenceData);
        this.expanded = true;
      });
  }
}

class ReferenceDataTableDescriptor extends TableDescriptor<ReferenceData> {

  constructor(private model: Model, private localizer: Localizer, private editReferenceDataModal: EditReferenceDataModal, private viewReferenceDataModal: ViewReferenceDataModal) {
    super();
  }

  columnDescriptors(referenceDatas: ReferenceData[]): ColumnDescriptor<ReferenceData>[] {

    const clickHandler = (value: ReferenceData) => {
      if (value.isExternal()) {
        window.open(value.id.uri, '_blank');
      } else {
        this.viewReferenceDataModal.open(value, this.model);
      }
    };

    return [
      { headerName: 'Code scheme name', nameExtractor: referenceData => this.localizer.translate(referenceData.title), onClick: clickHandler },
      { headerName: 'Description', nameExtractor: referenceData => this.localizer.translate(referenceData.description) }
    ];
  }

  canEdit(referenceData: ReferenceData): boolean {
    return referenceData.isExternal();
  }

  edit(value: ReferenceData): any {
    this.editReferenceDataModal.openEdit(value, this.model, this.localizer.language);
  }

  canRemove(referenceData: ReferenceData): boolean {
    return true;
  }

  orderBy(referenceData: ReferenceData): any {
    return referenceData.identifier;
  }
}