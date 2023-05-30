// import { ILogService, IPromise, IQService } from 'angular';
// import { EditableEntityController, EditableScope, Rights } from 'app/components/form/editableEntityController';
// import { ClassService } from 'app/services/classService';
// import { SearchPredicateModal } from './searchPredicateModal';
// import { UserService } from 'app/services/userService';
// import { DeleteConfirmationModal } from 'app/components/common/deleteConfirmationModal';
// import { ErrorModal } from 'app/components/form/errorModal';
// import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';
// import { Class } from 'app/entities/class';
// import { Model } from 'app/entities/model';
// import { LanguageContext } from 'app/types/language';
// import { EditorContainer, ModelControllerService } from 'app/components/model/modelControllerService';
// import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
// import { changeToRestrictedStatus } from '@mju-psi/yti-common-ui';
// import { DatamodelConfirmationModalService } from 'app/services/confirmation-modal.service';

// @LegacyComponent({
//   bindings: {
//     id: '@',
//     class: '=',
//     model: '=',
//     modelController: '<',
//     parent: '<',
//     openPropertyId: '='
//   },
//   template: require('./classView.html')
// })
// export class ClassViewComponent extends EditableEntityController<Class> {

//   class: Class;
//   model: Model;
//   modelController: ModelControllerService;
//   parent: EditorContainer;
//   openPropertyId: string;

//   constructor($scope: EditableScope,
//               $log: ILogService,
//               private $q: IQService,
//               private searchPredicateModal: SearchPredicateModal,
//               private datamodelConfirmationModalService: DatamodelConfirmationModalService,
//               deleteConfirmationModal: DeleteConfirmationModal,
//               errorModal: ErrorModal,
//               private classService: ClassService,
//               userService: UserService,
//               private authorizationManagerService: AuthorizationManagerService) {
//     'ngInject';
//     super($scope, $log, deleteConfirmationModal, errorModal, userService);
//   }

//   $onInit() {
//     this.parent.registerView(this);

//     const editableProperties = () => this.getEditable() ? this.getEditable().properties : false;

//     this.$scope.$watch(() => editableProperties(), props => this.select(this.getEditable()));
//   }

//   $onDestroy() {
//     this.parent.deregisterView(this);
//   }

//   addProperty() {
//     this.searchPredicateModal.openAddProperty(this.model, this.editableInEdit!)
//       .then(property => {
//         this.editableInEdit!.addProperty(property);
//         this.openPropertyId = property.internalId.uuid;
//       }, modalCancelHandler);
//   }

//   create(entity: Class) {
//     return this.classService.createClass(entity)
//       .then(() => this.modelController.selectionEdited(null, entity));
//   }

//   update(entity: Class, oldEntity: Class) {
//     return this.classService.updateClass(entity, oldEntity.id, this.model).then(() => this.modelController.selectionEdited(oldEntity, entity));
//   }

//   remove(entity: Class) {
//     return this.classService.deleteClass(entity.id, this.model).then(() => this.modelController.selectionDeleted(entity));
//   }

//   rights(): Rights {
//     return {
//       edit: () => this.authorizationManagerService.canEditClass(this.model, this.class),
//       remove: () => this.authorizationManagerService.canRemoveClass(this.model, this.class)
//     };
//   }

//   getEditable(): Class {
//     return this.class;
//   }

//   setEditable(editable: Class) {
//     this.class = editable;
//   }

  // isReference(): boolean {
  //   return this.class.definedBy.id.notEquals(this.model.id);
  // }

  // getRemoveText(): string {
  //   const text = super.getRemoveText();
  //   return !this.isReference() ? text : text + ' from this ' + this.model.normalizedType;
  // }

  // openDeleteConfirmationModal() {
  //   const onlyDefinedInModel = this.isReference() ? this.model : null;
  //   return this.deleteConfirmationModal.open(this.getEditable(), this.getContext(), onlyDefinedInModel);
  // }

  // getContext(): LanguageContext {
  //   return this.model;
  // }

  // confirmChangeToRestrictedStatus(entity: Class, oldEntity: Class): boolean {
  //   return entity.status && oldEntity.status ? changeToRestrictedStatus(oldEntity.status, entity.status) : false;
  // }

  // confirmChangeToRestrictedStatusDialog(entity: Class, oldEntity: Class): IPromise<any> | null {

  //   const changeAtLeastOnePropertyStatusToRestricted = () => {
  //     let result = false;

  //     entity.properties.forEach(property => {

  //       const oldPropertyToUpdate = oldEntity.properties.find(prop => prop.internalId.uuid === property.internalId.uuid);

  //       if (oldPropertyToUpdate) {
  //         const toRestrictedStatus = changeToRestrictedStatus(oldPropertyToUpdate.status, property.status);

  //         if (toRestrictedStatus) {
  //           result = true;
  //         }
  //       } else if (changeToRestrictedStatus('DRAFT', property.status)) {
  //           result = true;
  //       }
  //     });

  //     return result;
  //   }

  //   const changeClassStatusToRestricted = (entity.status && oldEntity.status && changeToRestrictedStatus(oldEntity.status, entity.status));
  //   const showRestrictedStatusDialog = changeClassStatusToRestricted || changeAtLeastOnePropertyStatusToRestricted();

  //   return showRestrictedStatusDialog ? this.$q.when(this.datamodelConfirmationModalService.openChangeToRestrictedStatus()) : null;
  // }

  // confirmDialog(entity: Class, oldEntity: Class): IPromise<any> | null {
  //   // NOTE: This is not implemented or needed yet in ClassView.
  //   return null;
  // }
// }


import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EditableEntityController, Rights } from 'app/components/form/editableEntityController';
import { DefaultClassService } from 'app/services/classService';
import { SearchPredicateModal } from './searchPredicateModal';
import { DeleteConfirmationModal } from 'app/components/common/delete-confirmation-modal';
import { ErrorModal } from 'app/components/form/errorModal';
import { Class } from 'app/entities/class';
import { Model } from 'app/entities/model';
import { LanguageContext } from 'app/types/language';
import { EditorContainer, ModelControllerService } from 'app/components/model/modelControllerService';
import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
import { changeToRestrictedStatus, UserService } from '@mju-psi/yti-common-ui';
import { DatamodelConfirmationModalService } from 'app/services/confirmation-modal.service';
import { modalCancelHandler } from 'app/utils/angular';

@Component({
  selector: 'class-view',
  templateUrl: './class-view.html'
})
export class ClassViewComponent extends EditableEntityController<Class> implements OnInit, OnDestroy {

  @Input() id!: string;
  @Input() class!: Class;
  @Input() model!: Model;
  @Input() modelController!: ModelControllerService;
  @Input() parent!: EditorContainer;
  @Input() openPropertyId!: string;

  constructor(
    private searchPredicateModal: SearchPredicateModal,
    private datamodelConfirmationModalService: DatamodelConfirmationModalService,
    deleteConfirmationModal: DeleteConfirmationModal,
    errorModal: ErrorModal,
    private classService: DefaultClassService,
    userService: UserService,
    private authorizationManagerService: AuthorizationManagerService,
  ) {
    super(deleteConfirmationModal, errorModal, userService);
  }

  ngOnInit(): void {
    this.parent.registerView(this);
    this.select(this.class);
  }

  ngOnDestroy(): void {
    this.parent.deregisterView(this);
  }

  addProperty(): void {
    this.searchPredicateModal.openAddProperty(this.model, this.editableInEdit!)
      .then(property => {
        this.editableInEdit!.addProperty(property);
        this.openPropertyId = property.internalId.uuid;
      }, modalCancelHandler);
  }

  create(entity: Class): Promise<any> {
    return this.classService.createClass(entity)
      .then(() => this.modelController.selectionEdited(null, entity));
  }

  update(entity: Class, oldEntity: Class): Promise<any> {
    return this.classService.updateClass(entity, oldEntity.id, this.model).then(() => this.modelController.selectionEdited(oldEntity, entity));
  }

  remove(entity: Class): Promise<any> {
    return this.classService.deleteClass(entity.id, this.model).then(() => this.modelController.selectionDeleted(entity));
  }

  rights(): Rights {
    return {
      edit: () => this.authorizationManagerService.canEditClass(this.model, this.class),
      remove: () => this.authorizationManagerService.canRemoveClass(this.model, this.class)
    };
  }

  getEditable(): Class {
    return this.class;
  }

  setEditable(editable: Class): void {
    this.class = editable;
  }

  isReference(): boolean {
    return this.class.definedBy.id !== this.model.id;
  }

  getRemoveText(): string {
    const text = super.getRemoveText();
    return !this.isReference() ? text : text + ' from this ' + this.model.normalizedType;
  }

  openDeleteConfirmationModal(): Promise<void> {
    const onlyDefinedInModel = this.isReference() ? this.model : null;
    return this.deleteConfirmationModal.open(this.getEditable(), this.getContext(), onlyDefinedInModel);
  }

  getContext(): LanguageContext {
    return this.model;
  }

  confirmChangeToRestrictedStatus(entity: Class, oldEntity: Class): boolean {
    return entity.status && oldEntity.status ? changeToRestrictedStatus(oldEntity.status, entity.status) : false;
  }

  confirmChangeToRestrictedStatusDialog(entity: Class, oldEntity: Class): Promise<any> | null {

    const changeAtLeastOnePropertyStatusToRestricted = () => {
      let result = false;

      entity.properties.forEach(property => {

        const oldPropertyToUpdate = oldEntity.properties.find(prop => prop.internalId.uuid === property.internalId.uuid);

        if (oldPropertyToUpdate) {
          const toRestrictedStatus = changeToRestrictedStatus(oldPropertyToUpdate.status, property.status);

          if (toRestrictedStatus) {
            result = true;
          }
        } else if (changeToRestrictedStatus('DRAFT', property.status)) {
            result = true;
        }
      });

      return result;
    };

    const changeClassStatusToRestricted = (entity.status && oldEntity.status && changeToRestrictedStatus(oldEntity.status, entity.status));
    const showRestrictedStatusDialog = changeClassStatusToRestricted || changeAtLeastOnePropertyStatusToRestricted();

    return showRestrictedStatusDialog ? Promise.resolve(this.datamodelConfirmationModalService.openChangeToRestrictedStatus()) : null;
  }

  confirmDialog(entity: Class, oldEntity: Class): Promise<any> | null {
    // NOTE: This is not implemented or needed yet in ClassView.
    return null;
  }

}
