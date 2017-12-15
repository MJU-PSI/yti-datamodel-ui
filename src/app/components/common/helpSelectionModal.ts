import { ui } from 'angular';
import IModalService = ui.bootstrap.IModalService;
import IModalServiceInstance = ui.bootstrap.IModalServiceInstance;
import { InteractiveHelp } from '../../help/contract';
import { InteractiveHelpDisplay } from '../../help/components/interactiveHelpDisplay';

export class HelpSelectionModal {

  /* @ngInject */
  constructor(private $uibModal: IModalService) {
  }

  open(helps: InteractiveHelp[]) {
    return this.$uibModal.open({
      template: `
        <modal-template class="help-selection">
          <modal-title translate>Select help topic</modal-title>
       
          <modal-body class="full-height">
            <div class="row">
              <div class="col-md-12">
                <div class="help story-line" ng-repeat="help in ctrl.helps" ng-click="ctrl.startHelp(help)">
                  <h5>{{help.storyLine.title | translate}}</h5>
                  <div>{{help.storyLine.description | translate}}</div>
                </div>
              </div>
            </div>
          </modal-body>
         
          <modal-buttons>
            <button class="btn btn-primary" type="button" ng-click="$dismiss('cancel')" translate>Close</button>
          </modal-buttons>
        </modal-template>
      `,
      size: 'medium',
      controllerAs: 'ctrl',
      controller: HelpSelectionModalController,
      resolve: {
        helps: () => helps
      }
    }).result;
  }
}

class HelpSelectionModalController {

  /* @ngInject */
  constructor(private $uibModalInstance: IModalServiceInstance, public helps: InteractiveHelp[], private interactiveHelpDisplay: InteractiveHelpDisplay) {
  }

  startHelp(help: InteractiveHelp) {
    this.$uibModalInstance.close();
    this.interactiveHelpDisplay.open(help);
  }
}
