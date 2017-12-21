import { module as mod } from './module';
import { HistoryModal } from './historyModal';
import { Model } from 'app/entities/model';
import { Class } from 'app/entities/class';
import { Predicate } from 'app/entities/predicate';

mod.directive('history', () => {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      resource: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    template: `
      <button type="button" class="btn btn-action right" ng-click="ctrl.openHistory()" uib-tooltip="{{'Show history' | translate}}">
        <i class="fa fa-history"></i>
      </button>`,
    controller: HistoryController
  };
});

class HistoryController {

  model: Model;
  resource: Class|Predicate|Model;

  /* @ngInject */
  constructor(private historyModal: HistoryModal) {
  }

  openHistory() {
    this.historyModal.open(this.model, this.resource);
  }
}
