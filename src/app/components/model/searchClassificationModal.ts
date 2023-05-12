// import { IPromise, IScope } from 'angular';
// import { Classification } from 'app/entities/classification';
// import { ClassificationService } from 'app/services/classificationService';
// import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
// import { Exclusion } from 'app/utils/exclusion';
// import { WithId } from 'app/types/entity';
// import { comparingLocalizable } from 'app/utils/comparator';
// import { LanguageService } from 'app/services/languageService';

// export class SearchClassificationModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(exclude: Exclusion<WithId>): IPromise<Classification> {
//     return this.$uibModal.open({
//       template: require('./searchClassificationModal.html'),
//       size: 'md',
//       resolve: {
//         exclude: () => exclude
//       },
//       controller: SearchClassificationModalController,
//       controllerAs: '$ctrl'
//     }).result;
//   }
// }

// class SearchClassificationModalController {

//   classifications: Classification[];

//   constructor($scope: IScope,
//               private $uibModalInstance: IModalServiceInstance,
//               classificationService: ClassificationService,
//               private languageService: LanguageService,
//               exclude: Exclusion<WithId>) {
//     'ngInject';
//     classificationService.getClassifications()
//       .then(classifications => {
//         this.classifications = classifications.filter(c => !exclude(c));
//         this.classifications.sort(comparingLocalizable<Classification>(this.languageService.createLocalizer(), c => c.label));
//       });
//   }

//   get loading() {
//     return this.classifications == null;
//   }

//   select(classification: Classification) {
//     this.$uibModalInstance.close(classification);
//   }

//   close() {
//     this.$uibModalInstance.dismiss('cancel');
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Classification } from 'app/entities/classification';
import { ClassificationService } from 'app/services/classificationService';
import { Exclusion } from 'app/utils/exclusion';
import { WithId } from 'app/types/entity';
import { comparingLocalizable } from 'app/utils/comparator';
import { LanguageService } from 'app/services/languageService';

@Injectable({
  providedIn: 'root'
})
export class SearchClassificationModal {

  constructor(private modalService: NgbModal) {}

  open(exclude: Exclusion<WithId>): Promise<Classification> {
    const modalRef: NgbModalRef = this.modalService.open(SearchClassificationModalContent, { size: 'md' });
    modalRef.componentInstance.exclude = exclude;
    return modalRef.result;
  }
}

@Component({
  selector: 'search-classification-modal-content',
  templateUrl: './searchClassificationModal.html'
})
export class SearchClassificationModalContent {
  classifications: Classification[];
  exclude: Exclusion<WithId>;
  loading = true;

  constructor(private modal: NgbActiveModal,
              private classificationService: ClassificationService,
              private languageService: LanguageService) {}

  ngOnInit(): void {
    this.classificationService.getClassifications()
      .then((classifications) => {
        this.classifications = classifications.filter((c) => !this.exclude(c));
        this.classifications.sort(
          comparingLocalizable<Classification>(this.languageService.createLocalizer(), (c) => c.label)
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  select(classification: Classification) {
    this.modal.close(classification);
  }

  close() {
    this.modal.dismiss('cancel');
  }
}
