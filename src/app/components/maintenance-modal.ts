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


// import { Component, Inject } from '@angular/core';
// import { ILogService } from 'angular';
// import { identity } from '@mju-psi/yti-common-ui';
// import { modalCancelHandler } from 'app/utils/angular';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// @Component({
//   selector: 'app-maintenance-modal',
//   templateUrl: './maintenance-modal.component.html'
// })
// export class MaintenanceModalComponent {

//   // TODO ALES - poglej ILogService
//   constructor(private modalService: NgbModal, @Inject('ILogService') private $log: any) {}

//   open(err: any) {

//     this.$log.debug(err);

//     return this.modalService.open({
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
    console.debug(err);
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
