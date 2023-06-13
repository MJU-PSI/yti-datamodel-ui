// import { IPromise } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';
// import { ClassService } from 'app/services/classService';
// import { PredicateService } from 'app/services/predicateService';
// import { ModelService } from 'app/services/modelService';
// import { HistoryService } from 'app/services/historyService';
// import { UserService } from 'app/services/userService';
// import { Uri } from 'app/entities/uri';
// import { comparingDate } from 'app/utils/comparator';
// import { reversed, containsAny, identity } from '@mju-psi/yti-common-ui';
// import { Model } from 'app/entities/model';
// import { Class } from 'app/entities/class';
// import { Predicate } from 'app/entities/predicate';
// import { Entity } from 'app/entities/version';
// import { modalCancelHandler } from 'app/utils/angular';

// export class HistoryModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(model: Model, resource: Class|Predicate|Model) {
//     this.$uibModal.open({
//       template: require('./historyModal.html'),
//       size: resource instanceof Model ? 'lg' : 'md',
//       controllerAs: '$ctrl',
//       controller: HistoryModalController,
//       resolve: {
//         model: () => model,
//         resource: () => resource
//       }
//     }).result.then(identity, modalCancelHandler);
//   }
// }

// class HistoryModalController {

//   versions: Entity[];
//   selectedItem: Entity;
//   selection: Class|Predicate|Model;
//   showAuthor: boolean;
//   loading: boolean;

//   constructor(historyService: HistoryService,
//               private classService: ClassService,
//               private predicateService: PredicateService,
//               private modelService: ModelService,
//               userService: UserService,
//               public model: Model,
//               public resource: Class|Predicate|Model) {
//     'ngInject';
//     this.showAuthor = userService.isLoggedIn();

//     historyService.getHistory(resource.id).then(activity => {
//       this.versions = activity.versions.sort(reversed(comparingDate<Entity>(version => version.createdAt)));
//     });
//   }

//   isLoading(item: Entity) {
//     return item === this.selectedItem && this.loading;
//   }

//   isSelected(item: Entity) {
//     return this.selectedItem === item;
//   }

//   select(entity: Entity) {
//     this.selectedItem = entity;
//     this.loading = true;
//     this.fetchResourceAtVersion(entity.id).then(resource => {
//       this.selection = resource;
//       this.loading = false;
//     });
//   }

//   private fetchResourceAtVersion(versionId: Uri): IPromise<Class|Predicate|Model> {
//     if (containsAny(this.resource.type, ['class', 'shape'])) {
//       return this.classService.getClass(versionId, this.model);
//     } else if (containsAny(this.resource.type, ['attribute', 'association'])) {
//       return this.predicateService.getPredicate(versionId);
//     } else if (containsAny(this.resource.type, ['model', 'profile', 'library'])) {
//       return this.modelService.getModelByUrn(versionId);
//     } else {
//       throw new Error('Unsupported type: ' + this.resource.type);
//     }
//   }
// }

import { Component, Inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassService, DefaultClassService } from 'app/services/classService';
import { DefaultPredicateService, PredicateService } from 'app/services/predicateService';
import { DefaultModelService, ModelService } from 'app/services/modelService';
import { HistoryService } from 'app/services/historyService';
import { Uri } from 'app/entities/uri';
import { comparingDate } from 'app/utils/comparator';
import { reversed, containsAny, identity, UserService } from '@mju-psi/yti-common-ui';
import { Model } from 'app/entities/model';
import { Class } from 'app/entities/class';
import { Predicate } from 'app/entities/predicate';
import { Entity } from 'app/entities/version';
import { modalCancelHandler } from 'app/utils/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class HistoryEditorModal {

  constructor(private modalService: NgbModal) {}

  open(model: Model, resource: Class | Predicate | Model): Promise<boolean> {
    const modalRef = this.modalService.open(HistoryEditorModalContentComponent, { size: resource instanceof Model ? 'lg' : 'md', backdrop: 'static', keyboard: false });
    const instance = modalRef.componentInstance as HistoryEditorModalContentComponent;
    instance.model = model;
    instance.resource = resource;

    return modalRef.result;
  }
}

@Component({
  selector: 'app-history-modal-content',
  templateUrl: './history-editor-modal.html'
})
export class HistoryEditorModalContentComponent {

  versions: Entity[];
  selectedItem: Entity;
  selection: Class | Predicate | Model;
  showAuthor: boolean;
  loading: boolean;
  model: Model;
  resource: Class | Predicate | Model;

  constructor(private historyService: HistoryService,
              private classService: DefaultClassService,
              private predicateService: DefaultPredicateService,
              private modelService: DefaultModelService,
              private userService: UserService,
              private activeModal: NgbActiveModal) {
    this.showAuthor = this.userService.isLoggedIn();
  }

  ngOnInit(){
    this.loadHistory();
  }

  loadHistory() {
    this.historyService.getHistory(this.resource.id).then(activity => {
      this.versions = activity.versions.sort(reversed(comparingDate<Entity>(version => version.createdAt)));
    });
  }

  isLoading(item: Entity) {
    return item === this.selectedItem && this.loading;
  }

  isSelected(item: Entity) {
    return this.selectedItem === item;
  }

  select(entity: Entity) {
    this.selectedItem = entity;
    this.loading = true;
    this.fetchResourceAtVersion(entity.id).then(resource => {
      this.selection = resource;
      this.loading = false;
    });
  }

  private fetchResourceAtVersion(versionId: Uri): Promise<Class | Predicate | Model> {
    if (containsAny(this.resource.type, ['class', 'shape'])) {
      return this.classService.getClass(versionId, this.model);
    } else if (containsAny(this.resource.type, ['attribute', 'association'])) {
      return this.predicateService.getPredicate(versionId);
    } else if (containsAny(this.resource.type, ['model', 'profile', 'library'])) {
      return this.modelService.getModelByUrn(versionId);
    } else {
      throw new Error('Unsupported type: ' + this.resource.type);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss('cancel');
  }

  trackByVersionId(index: number, version: any): string {
    return version.id;
  }

}

