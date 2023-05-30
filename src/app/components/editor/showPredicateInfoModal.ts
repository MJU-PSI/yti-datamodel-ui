// import { IPromise } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';
// import { Model } from '../../entities/model';
// import { Predicate } from '../../entities/predicate';

// export class ShowPredicateInfoModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(model: Model, selection: Predicate): IPromise<void> {
//     return this.$uibModal.open({
//       template: require('./showPredicateInfoModal.html'),
//       size: 'lg',
//       controllerAs: '$ctrl',
//       controller: ShowPredicateInfoModalController,
//       backdrop: true,
//       resolve: {
//         model: () => model,
//         selection: () => selection
//       }
//     }).result;
//   }
// };

// class ShowPredicateInfoModalController {

//   constructor(public model: Model,
//               public selection: Predicate) {
//     'ngInject';
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Model } from '../../entities/model';
import { Predicate } from '../../entities/predicate';


@Injectable({
  providedIn: 'root'
})
export class ShowPredicateInfoModal {

  constructor(private modalService: NgbModal) { }

  open(model: Model, selection: Predicate): Promise<void> {
    const modalRef: NgbModalRef = this.modalService.open(ShowPredicateInfoModalComponent, { size: 'lg' });
    modalRef.componentInstance.model = model;
    modalRef.componentInstance.selection = selection;
    return modalRef.result;
  }
}

@Component({
  selector: 'app-show-prodicate-info-modal',
  templateUrl: './showPredicateInfoModal.html',
})
export class ShowPredicateInfoModalComponent {

  constructor(public model: Model,
              public selection: Predicate,
              private activeModal: NgbActiveModal) {
  }

  close() {
    this.activeModal.dismiss('cancel');
  }
}
