import { IScope } from 'angular';
import { module as mod } from './module';
import { ReferenceDataService } from 'app/services/referenceDataService';
import { ViewReferenceDataModal } from './viewReferenceDataModal';
import { ReferenceData, ReferenceDataCode } from 'app/entities/referenceData';
import { LanguageContext } from 'app/types/language';

mod.directive('referenceDataView', () => {
  return {
    scope: {
      referenceData: '=',
      context: '=',
      title: '@',
      showCodes: '='
    },
    restrict: 'E',
    template: require('./referenceDataView.html'),
    controllerAs: 'ctrl',
    bindToController: true,
    controller: ReferenceDataViewController
  };
});

class ReferenceDataViewController {

  referenceData: ReferenceData;
  context: LanguageContext;
  title: string;
  showCodes: boolean;
  codes: ReferenceDataCode[];

  constructor($scope: IScope, 
              referenceDataService: ReferenceDataService,
              private viewReferenceDataModal: ViewReferenceDataModal) {
    $scope.$watch(() => this.referenceData, referenceData => {
      if (referenceData && !referenceData.isExternal()) {
        referenceDataService.getReferenceDataCodes(referenceData)
          .then(values => this.codes = values);
      } else {
        this.codes = [];
      }
    });
  }

  browse() {
    if (this.referenceData.isExternal()) {
      window.open(this.referenceData.id.uri, '_blank');
    } else {
      this.viewReferenceDataModal.open(this.referenceData, this.context);
    }
  }
}
