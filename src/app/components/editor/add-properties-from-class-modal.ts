// import { IPromise } from 'angular';
// import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { LanguageService } from 'app/services/languageService';
// import { Property, Class } from 'app/entities/class';
// import { anyMatching, flatten, groupBy, stringMapToObject } from '@mju-psi/yti-common-ui';
// import { Model } from 'app/entities/model';

// const noExclude = (_property: Property) => false;

// export class AddPropertiesFromClassModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(klass: Class, classType: string, model: Model, exclude: (property: Property) => boolean = noExclude): IPromise<Property[]> {
//     return this.$uibModal.open({
//       template: require('./addPropertiesFromClassModal.html'),
//       size: 'adapting',
//       controllerAs: '$ctrl',
//       controller: AddPropertiesFromClassModalController,
//       resolve: {
//         klass: () => klass,
//         classType: () => classType,
//         model: () => model,
//         exclude: () => exclude
//       }
//     }).result;
//   }
// }

// export class AddPropertiesFromClassModalController {

//   properties: { [type: string]: Property[] };
//   selectedProperties: Property[];

//   constructor(private $uibModalInstance: IModalServiceInstance,
//               public languageService: LanguageService,
//               private gettextCatalog: GettextCatalog,
//               klass: Class,
//               public classType: string,
//               public model: Model,
//               private exclude: (property: Property) => boolean) {
//     'ngInject';
//     const propertiesWithKnownType = klass.properties.filter(p => p.normalizedPredicateType);
//     this.properties = stringMapToObject(groupBy(propertiesWithKnownType, property => property.normalizedPredicateType!));
//     this.selectAllWithKnownPredicates();
//   }

//   isExcluded(property: Property) {
//     return this.exclude(property);
//   }

//   selectAllWithKnownPredicates() {
//     const isRequiredNamespace = (ns: string) => anyMatching(this.model.importedNamespaces, importedNamespace => importedNamespace.namespace === ns);
//     this.selectPropertiesWithPredicate(property => isRequiredNamespace(property.predicateId.namespace));
//   }

//   selectAll() {
//     this.selectPropertiesWithPredicate(() => true);
//   }

//   private selectPropertiesWithPredicate(predicate: (property: Property) => boolean) {
//     this.selectedProperties = flatten(Object.values(this.properties)).filter(property => !this.exclude(property) && predicate((property)));
//   }

//   deselectAll() {
//     this.selectedProperties = [];
//   }

//   tooltip(property: Property) {
//     if (this.isExcluded(property)) {
//       return this.gettextCatalog.getString('Already added');
//     } else {
//       return this.languageService.translate(property.comment);
//     }
//   }

//   confirm() {
//     this.$uibModalInstance.close(this.selectedProperties.map(property => property.copy()));
//   }
// }

import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from 'app/services/languageService';
import { Property, Class } from 'app/entities/class';
import { anyMatching, flatten, groupBy, stringMapToObject } from '@mju-psi/yti-common-ui';
import { Model } from 'app/entities/model';
import { TranslateService } from '@ngx-translate/core';

const noExclude = (_property: Property) => false;

@Injectable({
  providedIn: 'root'
})
export class AddPropertiesFromClassModal {

  constructor(private modalService: NgbModal) {}

  open(klass: Class, classType: string, model: Model, exclude: (property: Property) => boolean = noExclude): Promise<Property[]> {
    const modalRef: NgbModalRef = this.modalService.open(AddPropertiesFromClassModalComponent, {
      size: 'adapting'
    });
    const instance: AddPropertiesFromClassModalComponent = modalRef.componentInstance;
    instance.klass = klass;
    instance.classType = classType;
    instance.model = model;
    instance.exclude = exclude;

    return modalRef.result;
  }
}

@Component({
  selector: 'add-properties-from-class-modal',
  templateUrl: './add-properties-from-class-modal.html'
})
export class AddPropertiesFromClassModalComponent {

  properties: { [type: string]: Property[] };
  selectedProperties: Property[];
  klass: Class;
  classType: string;
  model: Model;
  exclude: (property: Property) => boolean;

  constructor(public activeModal: NgbModalRef,
              public languageService: LanguageService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    const propertiesWithKnownType = this.klass.properties.filter(p => p.normalizedPredicateType);
    this.properties = stringMapToObject(groupBy(propertiesWithKnownType, property => property.normalizedPredicateType!));
    this.selectAllWithKnownPredicates();
  }

  isExcluded(property: Property) {
    return this.exclude(property);
  }

  selectAllWithKnownPredicates() {
    const isRequiredNamespace = (ns: string) => anyMatching(this.model.importedNamespaces, importedNamespace => importedNamespace.namespace === ns);
    this.selectPropertiesWithPredicate(property => isRequiredNamespace(property.predicateId.namespace));
  }

  selectAll() {
    this.selectPropertiesWithPredicate(() => true);
  }

  private selectPropertiesWithPredicate(predicate: (property: Property) => boolean) {
    this.selectedProperties = flatten(Object.values(this.properties)).filter(property => !this.exclude(property) && predicate((property)));
  }

  deselectAll() {
    this.selectedProperties = [];
  }

  tooltip(property: Property) {
    if (this.isExcluded(property)) {
      return this.translateService.instant('Already added');
    } else {
      return this.languageService.translate(property.comment);
    }
  }

  confirm() {
    this.activeModal.close(this.selectedProperties.map(property => property.copy()));
  }

  dismiss() {
    this.activeModal.dismiss('cancel');
  }
}
