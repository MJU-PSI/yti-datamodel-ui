// import { ILocationService, IScope } from 'angular';
// import { IModalScope, IModalStackService } from 'angular-ui-bootstrap';
// import { UserService } from 'app/services/userService';
// import { ConfirmationModal } from './common/confirmationModal';
// import { LegacyComponent, modalCancelHandler, nextUrl } from 'app/utils/angular';
// import { LocationService } from 'app/services/locationService';
// import { ConfigService } from 'app/services/configService';
// import { Subscription } from 'rxjs';

// const versionInfo = require('!raw-loader!../../version.txt')

// @LegacyComponent({
//   template: require('./application.html'),
// })
// export class ApplicationComponent {

//   applicationInitialized: boolean;
//   showFooter: boolean;
//   version: string;

//   private subscriptions: Subscription[] = [];

//   constructor($scope: IScope,
//               private $location: ILocationService,
//               $uibModalStack: IModalStackService,
//               userService: UserService,
//               confirmationModal: ConfirmationModal,
//               private locationService: LocationService,
//               configService: ConfigService) {

//     'ngInject';

//     this.subscriptions.push(userService.user$.subscribe(() => this.applicationInitialized = true));

//     this.version = versionInfo;

//     $scope.$watch(() => $location.path(), path => {
//       this.showFooter = !path.startsWith('/model');
//     });

//     $scope.$on('$locationChangeStart', (event, next) => {

//       const modal = $uibModalStack.getTop();

//       if (!!modal) {
//         const modalScope: IModalScope = modal.value.modalScope;

//         event.preventDefault();

//         confirmationModal.openCloseModal().then(() => {
//           modalScope.$dismiss('cancel');
//           $location.url(nextUrl($location, next));
//         }, modalCancelHandler);
//       }
//     });
//   }

//   get location() {
//     return this.locationService.location;
//   }

//   $onDestroy() {
//     this.subscriptions.forEach(s => s.unsubscribe());
//   }

//   navigateToInformation() {
//     this.$location.url('/information');
//   }
// }
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import { UserService } from 'app/services/userService';
import { ConfirmationModal } from './common/confirmationModal';
import { LocationService } from 'app/services/locationService';
import { ConfigService } from 'app/services/configService';
import { UserService } from '@mju-psi/yti-common-ui';



const versionInfo = require('!raw-loader!../../version.txt').default;

@Component({
  // selector: 'app-root',
  selector: 'application',
  templateUrl: './application.html',
  providers: [UserService]
})
export class ApplicationComponent implements OnInit, OnDestroy {

  applicationInitialized = false;
  showFooter = false;
  version: string;
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private confirmationModal: ConfirmationModal,
              private locationService: LocationService,
              private configService: ConfigService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.subscriptions.push(this.userService.user$.subscribe(() => this.applicationInitialized = true));

    this.version = versionInfo;

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showFooter = !event.url.startsWith('/model');
      });

    this.subscriptions.push(this.router.events.subscribe());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  navigateToInformation() {
    this.router.navigate(['/information']);
  }

  openCloseModal(next: string): Promise<void> {
    return this.confirmationModal.openCloseModal()
      .then(() => this.location.go(next))
      .catch(() => {});
  }

  canDeactivate(next: string): Promise<boolean> {
    const modalOpen = this.confirmationModal.isModalOpen();

    if (!modalOpen) {
      return Promise.resolve(true);
    }

    return this.openCloseModal(next).then(() => true).catch(() => false);
  }
}
