// import { IPromise, IScope } from 'angular';
// import { Classification } from 'app/entities/classification';
// import { Exclusion } from 'app/utils/exclusion';
// import { Organization } from 'app/entities/organization';
// import { OrganizationService } from 'app/services/organizationService';
// import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
// import { AuthorizationManagerService } from 'app/services/authorizationManagerService';

// export class SearchOrganizationModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(exclude: Exclusion<Organization>): IPromise<Organization> {
//     return this.$uibModal.open({
//       template: require('./searchOrganizationModal.html'),
//       size: 'md',
//       resolve: {
//         exclude: () => exclude
//       },
//       controller: SearchOrganizationModalController,
//       controllerAs: '$ctrl'
//     }).result;
//   }
// }

// class SearchOrganizationModalController {

//   organizations?: Organization[];

//   constructor($scope: IScope,
//               private $uibModalInstance: IModalServiceInstance,
//               organizationService: OrganizationService,
//               authorizationManagerService: AuthorizationManagerService,
//               exclude: Exclusion<Organization>) {
//     'ngInject';
//     organizationService.getOrganizations()
//       .then(organizations =>
//         this.organizations = authorizationManagerService.filterOrganizationsAllowedForUser(organizations.filter(c => !exclude(c))));
//   }

//   get loading() {
//     return this.organizations == null;
//   }

//   select(classification: Classification) {
//     this.$uibModalInstance.close(classification);
//   }

//   close() {
//     this.$uibModalInstance.dismiss('cancel');
//   }
// }

import { Component, Injectable, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Exclusion } from 'app/utils/exclusion';
import { Organization } from 'app/entities/organization';
import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
import { DefaultOrganizationService } from 'app/services/organizationService';

@Injectable({
  providedIn: 'root'
})
export class SearchOrganizationModal {

  constructor(private modalService: NgbModal) { }

  open(exclude: Exclusion<Organization>): Promise<Organization> {
    const modalRef = this.modalService.open(SearchOrganizationModalComponent, { size: 'md' });
    modalRef.componentInstance.exclude = exclude;
    return modalRef.result;
  }
}

@Component({
  selector: 'search-organization-modal',
  templateUrl: './searchOrganizationModal.html'
})
export class SearchOrganizationModalComponent implements OnInit {

  organizations: Organization[];

  exclude: Exclusion<Organization>;

  loading = true;

  constructor(public modal: NgbActiveModal,
    private organizationService: DefaultOrganizationService,
    private authorizationManagerService: AuthorizationManagerService) { }

  ngOnInit() {
    this.organizationService.getOrganizations().then(
      organizations => {
        this.organizations = this.authorizationManagerService.filterOrganizationsAllowedForUser(
          organizations.filter(c => !this.exclude(c))
        );
        this.loading = false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  select(organization: Organization) {
    this.modal.close(organization);
  }

  close() {
    this.modal.dismiss('cancel');
  }
}
