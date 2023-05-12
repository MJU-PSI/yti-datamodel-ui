// import { IPromise } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';
// import { KnownPredicateType } from 'app/types/entity';

// export class ChoosePredicateTypeModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(): IPromise<KnownPredicateType> {
//     return this.$uibModal.open({
//       template: require('./choosePredicateTypeModal.html'),
//       size: 'adapting',
//       controllerAs: '$ctrl',
//       controller: ChoosePredicateTypeModalController
//     }).result;
//   }
// };

// export class ChoosePredicateTypeModalController {
//   type: KnownPredicateType = 'attribute';
// }

import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KnownPredicateType } from 'app/types/entity';

@Injectable({
  providedIn: 'root'
})
export class ChoosePredicateTypeModalService {

  type: KnownPredicateType = 'attribute';

  constructor(private modalService: NgbModal) {}

  open(): Promise<KnownPredicateType> {
    const modalRef = this.modalService.open(ChoosePredicateTypeModalComponent, { size: 'adapting' });
    return modalRef.result;
  }
};

@Component({
  selector: 'choose-predicate-type-modal',
  templateUrl: './choose-predicate-type-modal.html'
})
export class ChoosePredicateTypeModalComponent {

  type: KnownPredicateType;

  constructor(public modal: NgbActiveModal) {}

}
