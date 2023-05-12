// import { IPromise, ILocationService } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';
// import { Model } from 'app/entities/model';
// import { identity } from '@mju-psi/yti-common-ui';
// import { modalCancelHandler } from 'app/utils/angular';

// export class NotificationModal {

//   constructor(private $uibModal: IModalService, private $location: ILocationService) {
//     'ngInject';
//   }

//   private open(title: string, body: string): IPromise<any> {
//     const modal = this.$uibModal.open({
//       template: `
//         <div class="modal-header modal-header-warning">
//           <h4 class="modal-title">
//             <a><i ng-click="$dismiss('cancel')" class="fas fa-times"></i></a>
//             <span translate>${title}</span>
//           </h4>
//         </div>

//         <div class="modal-body">
//           <span translate>${body}</span>
//         </div>

//         <div class="modal-footer">
//           <button class="btn btn-link" type="button" ng-click="$close('cancel')" translate>Close</button>
//         </div>
//         `,
//       size: 'adapting'
//     });

//     return modal.result.then(() => true, _err => true);
//   }

//   openNotLoggedIn() {
//     this.open('Session expired', 'Please login to perform the action').then(identity, modalCancelHandler);
//   }

//   openModelNotFound() {
//     this.open('Model not found', 'You will be redirected to the front page').then(() => this.$location.url('/'), modalCancelHandler);
//   }

//   openPageNotFound() {
//     this.open('Page not found', 'You will be redirected to the front page').then(() => this.$location.url('/'), modalCancelHandler);
//   }

//   openResourceNotFound(model: Model) {
//     return this.open('Resource not found', 'You will be redirected to the model').then(() => this.$location.url(model.iowUrl()), modalCancelHandler);
//   }
// }
import { Component, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'app/entities/model';
import { identity } from '@mju-psi/yti-common-ui';
import { Router } from '@angular/router';


@Injectable()
export class NotificationModal {

  constructor(private modal: NgbModal,  private router: Router) {
  }

  private open(title: string, body: string): Promise<boolean>{
    const modalRef = this.modal.open(NotificationModalComponent, { size: 'adapting' });
    const instance = modalRef.componentInstance as NotificationModalComponent;
    instance.title = title;
    instance.body = body;

    return modalRef.result.then(() => true, _err => true);
  }

  openNotLoggedIn() {
    this.open('Session expired', 'Please login to perform the action').then(identity, () => {});
  }

  openModelNotFound() {
    this.open('Model not found', 'You will be redirected to the front page').then(() => this.router.navigateByUrl('/'), () => {});
  }

  openPageNotFound() {
    this.open('Page not found', 'You will be redirected to the front page').then(() => this.router.navigateByUrl('/'), () => {});
  }

  openResourceNotFound(model: Model) {
    return this.open('Resource not found', 'You will be redirected to the model').then(() => this.router.navigateByUrl(model.iowUrl()), () => {});
  }

}

@Component({
  selector: 'notification-modal',
  template: `
    <div class="modal-header modal-header-warning">
      <h4 class="modal-title">
        <a><i (click)="cancel()" class="fas fa-times"></i></a>
        <span>{{ title }}</span>
      </h4>
    </div>

    <div class="modal-body">
      <span>{{ body }}</span>
    </div>

    <div class="modal-footer">
      <button class="btn btn-link" type="button" (click)="cancel()">Close</button>
    </div>
  `,
})
export class NotificationModalComponent {

  @Input() title: string;
  @Input() body: string;

  constructor(private modal: NgbActiveModal) {
  }

  cancel() {
    this.modal.dismiss('cancel');
  }
}
