// import { LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';
// import { Model } from '../../entities/model';
// import { MessagingService } from '../../services/messaging-service';
// import { ConfirmationModalService, ignoreModalClose } from '@mju-psi/yti-common-ui';
// import { ErrorModal } from '../form/errorModal';
// import { Config } from '../../entities/config';
// import { Url } from '../../entities/uri';
// import { UserService } from '../../services/userService';
// import { MassMigrateDatamodelResourceStatusesModalService } from 'app/components/model/mass-migrate-datamodel-resource-statuses-modal.component';
// import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
// import { NewDatamodelVersionModalService } from 'app/components/model/new-datamodel-version-modal.component';

// @LegacyComponent({
//   bindings: {
//     isMessagingEnabled: '<',
//     hasSubscription: '<',
//     changeHasSubscription: '&',
//     entity: '<',
//     context: '<',
//     editing: '<'
//   },
//   template: require('./modelActionMenu.html')
// })
// export class ModelActionMenuComponent {

//   entity: Model;
//   context: LanguageContext;
//   editing: boolean;
//   hasSubscription: boolean;
//   isMessagingEnabled: boolean;
//   uri: string;
//   config: Config;
//   changeHasSubscription: (enabled: boolean) => void;

//   constructor(private confirmationModalService: ConfirmationModalService,
//               private messagingService: MessagingService,
//               private errorModal: ErrorModal,
//               private userService: UserService,
//               private authorizationManagerService: AuthorizationManagerService,
//               private massMigrateDatamodelResourceStatusesModalService: MassMigrateDatamodelResourceStatusesModalService,
//               private newDatamodelVersionModalService: NewDatamodelVersionModalService) {
//     'ngInject';
//   }

//   $onInit() {

//     this.uri = this.entity.namespace.toString();
//   }

//   get showMenu(): boolean {

//     return this.canSubscribe || this.showMassMigrateDatamodelStatuses;
//   }

//   get canSubscribe(): boolean {

//     return this.isMessagingEnabled && this.userService.isLoggedIn();
//   }

//   get canAddSubscription(): boolean {

//     return this.canSubscribe && !this.hasSubscription;
//   }

//   get canRemoveSubscription(): boolean {

//     return this.canSubscribe && this.hasSubscription;
//   }

//   get canMassMigrateDatamodelStatuses(): boolean {

//     return this.authorizationManagerService.canEditModel(this.entity);
//   }

//   get showMassMigrateDatamodelStatuses(): boolean {

//     return this.canMassMigrateDatamodelStatuses && !this.editing;
//   }

//   get showCreateNewDatamodelVersion(): boolean {

//     return this.authorizationManagerService.canEditModel(this.entity);
//   }


//   addSubscription() {

//     const uri: string = this.stripHashTagFromEndOfUrl(this.entity.namespace);
//     const type = this.entity.normalizedType;
//     if (uri && type) {
//       this.confirmationModalService.open('ADD EMAIL SUBSCRIPTION TO RESOURCE REGARDING CHANGES?', undefined, '')
//         .then(() => {
//           this.messagingService.addSubscription(uri, type).subscribe(success => {
//             if (success) {
//               this.changeHasSubscription(true);
//             } else {
//               this.changeHasSubscription(false);
//               this.errorModal.openSubmitError('Adding subscription failed.');
//             }
//           });
//         }, ignoreModalClose);
//     }
//   }

//   removeSubscription() {

//     const uri: string = this.stripHashTagFromEndOfUrl(this.entity.namespace);
//     if (uri) {
//       this.confirmationModalService.open('REMOVE EMAIL SUBSCRIPTION TO RESOURCE?', undefined, '')
//         .then(() => {
//           this.messagingService.deleteSubscription(uri).subscribe(success => {
//             if (success) {
//               this.changeHasSubscription(false);
//             } else {
//               this.changeHasSubscription(true);
//               this.errorModal.openSubmitError('Subscription deletion failed.');
//             }
//           });
//         }, ignoreModalClose);
//     }
//   }

//   stripHashTagFromEndOfUrl(url: Url): string {

//     const uri = url.toString();

//     if (uri.endsWith('#')) {
//       return uri.substr(0, uri.length - 1);
//     }
//     return uri.toString();
//   }

//   massMigrateDatamodelStatuses() {
//     this.massMigrateDatamodelResourceStatusesModalService.open(this.entity);
//   }

//   createNewDatamodelVersion() {
//     this.newDatamodelVersionModalService.open(this.entity);
//   }
// }


import { LanguageContext } from 'app/types/language';
import { LegacyComponent } from 'app/utils/angular';
import { Model } from '../../entities/model';
import { MessagingService } from '../../services/messaging-service';
import { ConfirmationModalService, ignoreModalClose } from '@mju-psi/yti-common-ui';
import { ErrorModal } from '../form/errorModal';
import { Config } from '../../entities/config';
import { Url } from '../../entities/uri';
import { USER_SERVICE, UserService } from '../../services/userService';
import { MassMigrateDatamodelResourceStatusesModalService } from 'app/components/model/mass-migrate-datamodel-resource-statuses-modal.component';
import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
import { NewDatamodelVersionModalService } from 'app/components/model/new-datamodel-version-modal.component';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

@Component({
  selector: 'model-action-menu',
  templateUrl: './modelActionMenu.html'
})
export class ModelActionMenuComponent {

  @Input() entity: Model;
  @Input() context: LanguageContext;
  @Input() editing: boolean;
  @Input() hasSubscription: boolean;
  @Input() isMessagingEnabled: boolean;

  @Output() changeHasSubscription = new EventEmitter<boolean>();

  uri: string;
  config: Config;

  constructor(private confirmationModalService: ConfirmationModalService,
              private messagingService: MessagingService,
              private errorModal: ErrorModal,
              @Inject(USER_SERVICE) private userService: UserService,
              private authorizationManagerService: AuthorizationManagerService,
              private massMigrateDatamodelResourceStatusesModalService: MassMigrateDatamodelResourceStatusesModalService,
              private newDatamodelVersionModalService: NewDatamodelVersionModalService) {
  }

  $onInit() {

    this.uri = this.entity.namespace.toString();
  }

  get showMenu(): boolean {

    return this.canSubscribe || this.showMassMigrateDatamodelStatuses;
  }

  get canSubscribe(): boolean {

    return this.isMessagingEnabled && this.userService.isLoggedIn();
  }

  get canAddSubscription(): boolean {

    return this.canSubscribe && !this.hasSubscription;
  }

  get canRemoveSubscription(): boolean {

    return this.canSubscribe && this.hasSubscription;
  }

  get canMassMigrateDatamodelStatuses(): boolean {

    return this.authorizationManagerService.canEditModel(this.entity);
  }

  get showMassMigrateDatamodelStatuses(): boolean {

    return this.canMassMigrateDatamodelStatuses && !this.editing;
  }

  get showCreateNewDatamodelVersion(): boolean {

    return this.authorizationManagerService.canEditModel(this.entity);
  }


  addSubscription() {

    const uri: string = this.stripHashTagFromEndOfUrl(this.entity.namespace);
    const type = this.entity.normalizedType;
    if (uri && type) {
      this.confirmationModalService.open('ADD EMAIL SUBSCRIPTION TO RESOURCE REGARDING CHANGES?', undefined, '')
        .then(() => {
          this.messagingService.addSubscription(uri, type).subscribe(success => {
            if (success) {
              this.changeHasSubscription.emit(true);
            } else {
              this.changeHasSubscription.emit(false);
              this.errorModal.openSubmitError('Adding subscription failed.');
            }
          });
        }, ignoreModalClose);
    }
  }

  removeSubscription() {

    const uri: string = this.stripHashTagFromEndOfUrl(this.entity.namespace);
    if (uri) {
      this.confirmationModalService.open('REMOVE EMAIL SUBSCRIPTION TO RESOURCE?', undefined, '')
        .then(() => {
          this.messagingService.deleteSubscription(uri).subscribe(success => {
            if (success) {
              this.changeHasSubscription.emit(false);
            } else {
              this.changeHasSubscription.emit(true);
              this.errorModal.openSubmitError('Subscription deletion failed.');
            }
          });
        }, ignoreModalClose);
    }
  }

  stripHashTagFromEndOfUrl(url: Url): string {

    const uri = url.toString();

    if (uri.endsWith('#')) {
      return uri.substr(0, uri.length - 1);
    }
    return uri.toString();
  }

  massMigrateDatamodelStatuses() {
    this.massMigrateDatamodelResourceStatusesModalService.open(this.entity);
  }

  createNewDatamodelVersion() {
    this.newDatamodelVersionModalService.open(this.entity);
  }
}
