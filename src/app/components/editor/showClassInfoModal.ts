// import { IPromise } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';
// import { Class } from '../../entities/class';
// import { Model } from '../../entities/model';
// import { ExternalEntity } from '../../entities/externalEntity';

// export class ShowClassInfoModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(model: Model, selection: Class | ExternalEntity): IPromise<void> {
//     return this.$uibModal.open({
//       template: require('./showClassInfoModal.html'),
//       size: 'lg',
//       controllerAs: '$ctrl',
//       controller: ShowClassInfoModalController,
//       backdrop: true,
//       resolve: {
//         model: () => model,
//         selection: () => selection
//       }
//     }).result;
//   }
// };

// class ShowClassInfoModalController {

//   constructor(public model: Model,
//               public selection: Class | ExternalEntity) {
//     'ngInject';
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Class } from '../../entities/class';
import { Model } from '../../entities/model';
import { ExternalEntity } from '../../entities/externalEntity';

@Injectable({
  providedIn: 'root'
})
export class ShowClassInfoModal {
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open(model: Model, selection: Class | ExternalEntity): Promise<void> {
    this.modalRef = this.modalService.open(ShowClassInfoModalComponent, { size: 'lg', backdrop: true });
    this.modalRef.componentInstance.model = model;
    this.modalRef.componentInstance.selection = selection;
    return this.modalRef.result;
  }

  dismissModal() {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }
}

@Component({
  selector: 'show-class-info-modal-content',
  templateUrl: './showClassInfoModal.html'
})
export class ShowClassInfoModalComponent {
  public model: Model;
  public selection: Class | ExternalEntity;

  constructor(public modal: NgbActiveModal) {}

  dismissModal() {
    this.modal.dismiss('cancel');
  }
}
