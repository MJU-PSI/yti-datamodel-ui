// import { ILogService } from 'angular';
// import { identity } from '@mju-psi/yti-common-ui';
// import { modalCancelHandler } from 'app/utils/angular';
// import { IModalService } from 'angular-ui-bootstrap';

// export class MaintenanceModal {

//   constructor(private $uibModal: IModalService, private $log: ILogService) {
//     'ngInject';
//   }

//   open(err: any) {

//     this.$log.debug(err);

//     return this.$uibModal.open({
//       template: require('./maintenance.html'),
//       size: 'lg',
//       backdrop: 'static'
//     }).result.then(identity, modalCancelHandler);
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceModal {

  constructor(private modalService: NgbModal) { }

  open(err: any) {
    return this.modalService.open(MaintenanceModalComponent, { size: 'lg', backdrop: 'static' })
  }
}

@Component({
  selector: 'maintenance-modal',
  templateUrl: './maintenance-modal.html'
})
export class MaintenanceModalComponent {
  constructor() { }
}
