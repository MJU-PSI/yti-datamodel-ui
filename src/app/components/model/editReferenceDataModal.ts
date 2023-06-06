// import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
// import { Uri } from 'app/entities/uri';
// import { Language, LanguageContext } from 'app/types/language';
// import { ReferenceData } from 'app/entities/referenceData';
// import { identity } from '@mju-psi/yti-common-ui';
// import { modalCancelHandler } from 'app/utils/angular';

// export class EditReferenceDataModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   private open(context: LanguageContext, lang: Language, referenceDataToEdit: ReferenceData) {
//     this.$uibModal.open({
//       template: require('./editReferenceDataModal.html'),
//       size: 'sm',
//       controller: EditReferenceDataModalController,
//       controllerAs: '$ctrl',
//       backdrop: true,
//       resolve: {
//         context: () => context,
//         lang: () => lang,
//         referenceDataToEdit: () => referenceDataToEdit
//       }
//     }).result.then(identity, modalCancelHandler);
//   }

//   openEdit(referenceData: ReferenceData, context: LanguageContext, lang: Language) {
//     this.open(context, lang, referenceData);
//   }
// }

// class EditReferenceDataModalController {

//   id: Uri;
//   title: string;
//   description: string;

//   constructor(private $uibModalInstance: IModalServiceInstance,
//               private lang: Language,
//               public context: LanguageContext,
//               private referenceDataToEdit: ReferenceData) {
//     'ngInject';
//     this.id = referenceDataToEdit.id;
//     this.title = referenceDataToEdit.title[lang];
//     this.description = referenceDataToEdit.description[lang];
//   }

//   create() {
//     this.referenceDataToEdit.id = this.id;
//     this.referenceDataToEdit.title[this.lang] = this.title;
//     this.referenceDataToEdit.description[this.lang] = this.description;

//     this.$uibModalInstance.close(this.referenceDataToEdit);
//   }

//   cancel() {
//     this.$uibModalInstance.dismiss('cancel');
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Uri } from 'app/entities/uri';
import { Language, LanguageContext } from 'app/types/language';
import { ReferenceData } from 'app/entities/referenceData';
import { identity } from '@mju-psi/yti-common-ui';
import { modalCancelHandler } from 'app/utils/angular';

@Injectable({
  providedIn: 'root'
})
export class EditReferenceDataModal {

  constructor(private modalService: NgbModal) {}

  openEdit(referenceData: ReferenceData, context: LanguageContext, lang: Language): Promise<ReferenceData> {
    const modalRef: NgbModalRef = this.modalService.open(EditReferenceDataModalComponent, {
      size: 'sm',
      backdrop: true,
      centered: true
    });
    modalRef.componentInstance.lang = lang;
    modalRef.componentInstance.context = context;
    modalRef.componentInstance.referenceDataToEdit = referenceData;
    return modalRef.result.then(identity, modalCancelHandler);
  }
}

@Component({
  selector: 'app-edit-reference-data-modal',
  templateUrl: './editReferenceDataModal.html',
})
export class EditReferenceDataModalComponent {

  public lang: Language;
  public context: LanguageContext;
  public referenceDataToEdit: ReferenceData;

  id: Uri;
  title: string;
  description: string;

  constructor(private modalRef: NgbModalRef) {}

  create() {
    this.referenceDataToEdit.id = this.id;
    this.referenceDataToEdit.title[this.lang] = this.title;
    this.referenceDataToEdit.description[this.lang] = this.description;
    this.modalRef.close(this.referenceDataToEdit);
  }

  cancel() {
    this.modalRef.dismiss('cancel');
  }
}
