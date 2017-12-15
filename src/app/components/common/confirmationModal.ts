import { IPromise, ui } from 'angular';
import IModalService = ui.bootstrap.IModalService;

export class ConfirmationModal {
  /* @ngInject */
  constructor(private $uibModal: IModalService) {
  }

  private open(title: string, body: string, additionalCssClass?: string): IPromise<void> {
    return this.$uibModal.open({
      template: `<div class="confirmation">
                   <modal-template purpose="warning" default="true">
                     <modal-title>{{ctrl.title | translate}}</modal-title>
                     <modal-body>{{ctrl.body | translate}}</modal-body>
                   </modal-template>
                 </div>`,
      controllerAs: 'ctrl',
      /* @ngInject */
      controller: ConfirmationModalController,
      windowClass: additionalCssClass,
      resolve: {
        title: () => title,
        body: () => body
      }
    }).result;
  }

  openEditInProgress() {
    return this.open('Edit in progress', 'Are you sure that you want to continue? By continuing unsaved changes will be lost.');
  }

  openCloseModal() {
    return this.open('Dialog is open', 'Are you sure that you want to close dialog?');
  }

  openCloseHelp() {
    return this.open('Help is open', 'Are you sure that you want to close help?', 'over-help');
  }

  openVisualizationLocationsSave() {
    return this.open('Save visualization position', 'Are you sure you want to save? Saving overrides previously saves positions.');
  }
}

class ConfirmationModalController {
  constructor(public title: string, public body: string) {
  }
}
