// import { IPromise } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';

// export class ConfirmationModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   private open(title: string, body: string, additionalCssClass?: string): IPromise<void> {
//     return this.$uibModal.open({
//       template: `
//         <div class="confirmation">

//           <div class="modal-header modal-header-warning">
//             <h4 class="modal-title">
//               <a><i ng-click="$dismiss('cancel')" class="fas fa-times"></i></a>
//               {{$ctrl.title | translate}}
//             </h4>
//           </div>

//           <div class="modal-body">
//             {{$ctrl.body | translate}}
//           </div>

//           <div class="modal-footer">
//             <button id="confirm_modal_template_button" class="btn btn-action confirm" type="button" ng-click="$close()" translate>Yes</button>
//             <button id="cancel_modal_template_button" class="btn btn-link" type="button" ng-click="$dismiss('cancel')" translate>Cancel</button>
//           </div>

//        </div>
//       `,
//       controllerAs: '$ctrl',
//       controller: ConfirmationModalController,
//       windowClass: additionalCssClass,
//       resolve: {
//         title: () => title,
//         body: () => body
//       }
//     }).result;
//   }

//   openEditInProgress() {
//     return this.open('Edit in progress', 'Are you sure that you want to continue? By continuing unsaved changes will be lost.');
//   }

//   openCloseModal() {
//     return this.open('Dialog is open', 'Are you sure that you want to close dialog?');
//   }

//   openCloseHelp() {
//     return this.open('Help is open', 'Are you sure that you want to close help?', 'over-help');
//   }

//   openVisualizationLocationsSave() {
//     return this.open('Save visualization position', 'Are you sure you want to save? Saving overrides previously saves positions.');
//   }
// }

// class ConfirmationModalController {
//   constructor(public title: string, public body: string) {
//     'ngInject';
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModal {

  modalOpen = false; // add a property to track if modal is open

  constructor(private modalService: NgbModal) {}

  private open(title: string, body: string, additionalCssClass?: string): Promise<void> {
    const modalRef = this.modalService.open(ConfirmationModalContentComponent, {
      backdrop: 'static',
      keyboard: false,
      windowClass: additionalCssClass,
    });

    this.modalOpen = true; // set modalOpen to true when the modal is opened

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;

    return modalRef.result.finally(() => { // set modalOpen to false when the modal is closed or dismissed
      this.modalOpen = false;
    });
  }

  isModalOpen() {
    return this.modalOpen; // return the value of modalOpen
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

@Component({
  template: `
    <div class="confirmation">

      <div class="modal-header modal-header-warning">
        <h4 class="modal-title">
          <a><i (click)="dismiss()" class="fas fa-times"></i></a>
          {{title}}
        </h4>
      </div>

      <div class="modal-body">
        {{body}}
      </div>

      <div class="modal-footer">
        <button id="confirm_modal_template_button" class="btn btn-action confirm" type="button" (click)="close()" translate>Yes</button>
        <button id="cancel_modal_template_button" class="btn btn-link" type="button" (click)="dismiss()" translate>Cancel</button>
      </div>

    </div>
  `,
})
export class ConfirmationModalContentComponent {
  title: string;
  body: string;

  constructor(private activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}

