// import { IModalService } from 'angular-ui-bootstrap';
// import { ReferenceData } from 'app/entities/referenceData';
// import { LanguageContext } from 'app/types/language';
// import { identity } from '@mju-psi/yti-common-ui';
// import { modalCancelHandler } from 'app/utils/angular';

// export class ViewReferenceDataModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(referenceData: ReferenceData, context: LanguageContext) {
//     this.$uibModal.open({
//       template: `
//         <form class="view-reference-data">

//           <div class="modal-header">
//             <h4 class="modal-title">
//               <a><i ng-click="$dismiss('cancel')" class="fas fa-times"></i></a>
//               <span translate>Reference data information</span>
//             </h4>
//           </div>

//           <div class="modal-body full-height">
//             <div class="row">
//               <div class="col-md-12">
//                 <reference-data-view reference-data="$ctrl.referenceData" context="$ctrl.context" class="popup" show-codes="true"></reference-data-view>
//               </div>
//             </div>
//           </div>

//           <div class="modal-footer">
//             <button class="btn btn-link" type="button" ng-click="$dismiss('cancel')" translate>Close</button>
//           </div>

//         </form>
//       `,
//       size: 'md',
//       controller: ViewReferenceDataModalController,
//       controllerAs: '$ctrl',
//       backdrop: true,
//       resolve: {
//         referenceData: () => referenceData,
//         context: () => context
//       }
//     }).result.then(identity, modalCancelHandler);
//   }
// }

// export class ViewReferenceDataModalController {

//   constructor(public referenceData: ReferenceData, public context: LanguageContext) {
//     'ngInject';
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReferenceData } from 'app/entities/referenceData';
import { LanguageContext } from 'app/types/language';
import { identity } from '@mju-psi/yti-common-ui';
import { modalCancelHandler } from 'app/utils/angular';

@Injectable({
  providedIn: 'root'
})
export class ViewReferenceDataModal {
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open(referenceData: ReferenceData, context: LanguageContext) {
    this.modalRef = this.modalService.open(ViewReferenceDataComponent, { size: 'md', backdrop: 'static' });
    this.modalRef.componentInstance.referenceData = referenceData;
    this.modalRef.componentInstance.context = context;
    this.modalRef.result.then(identity, modalCancelHandler);
  }

  dismissModal() {
    if (this.modalRef) {
      this.modalRef.dismiss('cancel');
    }
  }
}

@Component({
  selector: 'view-reference-data-modal-content',
  template: `
    <form class="view-reference-data">

      <div class="modal-header">
        <h4 class="modal-title">
          <a><i (click)="dismissModal()" class="fas fa-times"></i></a>
          <span translate>Reference data information</span>
        </h4>
      </div>

      <div class="modal-body full-height">
        <div class="row">
          <div class="col-md-12">
            <reference-data-view [referenceData]="referenceData" [context]="context" class="popup" [showCodes]="true"></reference-data-view>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-link" type="button" (click)="dismissModal()" translate>Close</button>
      </div>

    </form>
  `
})
export class ViewReferenceDataComponent {
  referenceData: ReferenceData;
  context: LanguageContext;

  constructor(public modal: NgbActiveModal) {}

  dismissModal() {
    this.modal.dismiss('cancel');
  }
}
