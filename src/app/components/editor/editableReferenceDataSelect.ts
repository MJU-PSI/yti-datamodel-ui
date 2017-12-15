import { IScope, IAttributes } from 'angular';
import { EditableForm } from 'app/components/form/editableEntityController';
import { SearchReferenceDataModal } from 'app/components/model/searchReferenceDataModal';
import { module as mod } from './module';
import { ViewReferenceDataModal } from 'app/components/model/viewReferenceDataModal';
import { TableDescriptor, ColumnDescriptor } from 'app/components/form/editableTable';
import { Localizer, LanguageService } from 'app/services/languageService';
import { collectProperties } from 'yti-common-ui/utils/array';
import { createExistsExclusion } from 'app/utils/exclusion';
import { ReferenceData } from 'app/entities/referenceData';
import { Model } from 'app/entities/model';
import { remove } from 'yti-common-ui/utils/array';
import { modalCancelHandler } from 'app/utils/angular';

mod.directive('editableReferenceDataSelect', () => {
  return {
    scope: {
      referenceData: '=',
      model: '='
    },
    restrict: 'E',
    controllerAs: 'ctrl',
    bindToController: true,
    template: require('./editableReferenceDataSelect.html'),
    require: ['editableReferenceDataSelect', '?^form'],
    link(_$scope: IScope, _element: JQuery, _attributes: IAttributes, [thisController, formController]: [EditableReferenceDataSelectController, EditableForm]) {
      thisController.isEditing = () => formController.editing;
    },
    controller: EditableReferenceDataSelectController
  };
});

class EditableReferenceDataSelectController {

  isEditing: () => boolean;
  referenceData: ReferenceData[];
  model: Model;
  expanded: boolean;
  descriptor: ReferenceDataTableDescriptor;

  /* @ngInject */
  constructor($scope: IScope, private searchReferenceDataModal: SearchReferenceDataModal, languageService: LanguageService, viewReferenceDataModal: ViewReferenceDataModal) {
    $scope.$watch(() => this.referenceData, referenceData => {
      this.descriptor = new ReferenceDataTableDescriptor(referenceData, this.model, languageService.createLocalizer(this.model), viewReferenceDataModal);
    });
  }

  addReferenceData() {
    const exclude = createExistsExclusion(collectProperties(this.referenceData, rd => rd.id.uri));

    this.searchReferenceDataModal.openSelectionForProperty(this.model, exclude).then(referenceData => {
      this.expanded = true;
      this.referenceData.push(referenceData);
    }, modalCancelHandler);
  }
}

class ReferenceDataTableDescriptor extends TableDescriptor<ReferenceData> {

  constructor(private referenceData: ReferenceData[], private model: Model, private localizer: Localizer, private viewReferenceDataModal: ViewReferenceDataModal) {
    super();
  }

  columnDescriptors(): ColumnDescriptor<ReferenceData>[] {

    // TODO: shared logic with referenceDatasView.ts
    const clickHandler = (value: ReferenceData) => {
      if (value.isExternal()) {
        window.open(value.id.uri, '_blank');
      } else {
        this.viewReferenceDataModal.open(value, this.model);
      }
    };

    return [
      { headerName: 'Reference data name', nameExtractor: referenceData => this.localizer.translate(referenceData.title), onClick: clickHandler },
      { headerName: 'Description', nameExtractor: referenceData => this.localizer.translate(referenceData.description) }
    ];
  }

  values(): ReferenceData[] {
    return this.referenceData;
  }

  canEdit(_referenceData: ReferenceData): boolean {
    return false;
  }

  edit(_referenceData: ReferenceData): any {
    throw new Error('Edit unsupported');
  }

  remove(referenceData: ReferenceData): any {
    remove(this.values(), referenceData);
  }

  canRemove(_referenceData: ReferenceData): boolean {
    return true;
  }

  orderBy(referenceData: ReferenceData): any {
    return referenceData.identifier;
  }
}
