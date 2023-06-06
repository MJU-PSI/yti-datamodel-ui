import { DeleteConfirmationModal } from 'app/components/common/delete-confirmation-modal';
import { isModalCancel } from 'app/utils/angular';
import { ErrorModal } from './errorModal';
import { LanguageContext } from 'app/types/language';
import { EditableEntity } from 'app/types/entity';
import { ignoreModalClose, UserService } from '@mju-psi/yti-common-ui';
import { OnInit, ViewChild } from '@angular/core';

// export interface EditableForm extends IFormController {
//   editing: boolean;

//   // TODO: There is dirty hack in editable.ts to prevent hidden or disabled fields from participating in validation. The hack also
//   //       destroys validation of newly created entities IF those flash in non-edit mode first. Based on earlier comments it seems
//   //       that going straight to editing state may cause problems with confirmation dialogs, so here comes... another hack. I am sorry.
//   // TODO: So basically there are two pending fixes. Firstly, a real solution to validation problem, probably by (shockingly) not rendering
//   //       such fields as editable components, hidden or not! Secondly, it makes no sense to "display" resource creation forms before
//   //       going to edit mode.
//   pendingEdit?: boolean;
// }
import { AbstractControl, NgForm } from '@angular/forms';
import { Component, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

export interface EditableForm extends AbstractControl  {
  editing: boolean;
  pendingEdit?: boolean;
}

// export interface EditableScope extends IScope {
//   form: EditableForm;
// }

export interface EditableScope  {
  form: EditableForm;
}


export interface Rights {
  edit(): boolean;

  remove(): boolean;
}

// export abstract class EditableEntityController<T extends EditableEntity> {

//   editableInEdit: T | null = null;
//   persisting: boolean;

//   constructor(protected $scope: EditableScope,
//               private $log: ILogService,
//               protected deleteConfirmationModal: DeleteConfirmationModal,
//               private errorModal: ErrorModal,
//               protected userService: UserService) {

//     $scope.$watch(() => userService.isLoggedIn(), (isLoggedIn, wasLoggedIn) => {
//       if (!isLoggedIn && wasLoggedIn) {
//         this.cancelEditing();
//       }
//     });

//     $scope.$watch(() => this.getEditable(), editable => this.select(editable));
//   }

//   abstract create(entity: T): IPromise<any>;

//   abstract update(entity: T, oldEntity: T): IPromise<any>;

//   abstract remove(entity: T): IPromise<any>;

//   abstract rights(): Rights;

//   abstract getEditable(): T | null;

//   abstract setEditable(editable: T | null): void;

//   abstract getContext(): LanguageContext;

//   abstract confirmChangeToRestrictedStatusDialog(entity: T, oldEntity: T): IPromise<any> | null;

//   abstract confirmDialog(entity: T, oldEntity: T): IPromise<any> | null;

//   select(editable: T | null) {
//     this.setEditable(editable);
//     this.editableInEdit = editable ? <T>editable.clone() : null;

//     if (editable && editable.unsaved) {
//       // XXX: prevent problems with unsaved navigation confirmation
//       this.$scope.form.pendingEdit = true;
//       setTimeout(() => this.edit());
//     } else {
//       this.cancelEditing();
//     }
//   }

//   saveEdited() {

//     const editable = this.getEditable();
//     const editableInEdit = this.editableInEdit;

//     const save = () => {
//       this.persisting = true;

//       (editable!.unsaved ? this.create(editableInEdit!) : this.update(editableInEdit!, editable!))
//         .then(() => {
//           this.select(editableInEdit);
//           this.persisting = false;
//         }, (err: any) => {
//           if (err) {
//             this.$log.error(err);
//             this.errorModal.openSubmitError((err.data && err.data.errorMessage) || 'Unexpected error');
//           }
//           this.persisting = false;
//         });
//     };

//     const confirmAndSave = () => {
//       const confirmDialog = this.confirmDialog(editableInEdit!, editable!);

//       if (confirmDialog) {
//         confirmDialog.then(() => save(), ignoreModalClose);
//       } else {
//         save();
//       }
//     };

//     const confirmRestrictedStatusDialog = this.confirmChangeToRestrictedStatusDialog(editableInEdit!, editable!);

//     if (confirmRestrictedStatusDialog) {
//       confirmRestrictedStatusDialog.then(() => confirmAndSave(), ignoreModalClose);
//     } else {
//       confirmAndSave();
//     }

//   }

//   openDeleteConfirmationModal(): IPromise<void> {
//     return this.deleteConfirmationModal.open(this.getEditable()!, this.getContext());
//   }

//   removeEdited() {

//     const editable = this.getEditable();
//     this.persisting = true;
//     this.openDeleteConfirmationModal()
//       .then(() => this.remove(editable!))
//       .then(() => {
//         this.select(null);
//         this.persisting = false;
//       }, err => {
//         if (!isModalCancel(err)) {
//           this.$log.error(err);
//           this.errorModal.openSubmitError((err.data && err.data.errorMessage) || 'Unexpected error');
//         }
//         this.persisting = false;
//       });
//   }

//   canRemove() {
//     const editable = this.getEditable();
//     return editable && !editable.unsaved && !this.isEditing() && this.rights().remove();
//   }

//   cancelEditing() {
//     if (this.isEditing()) {
//       this.$scope.form.editing = false;
//       this.$scope.form.$setPristine();
//       const editable = this.getEditable();
//       this.select(editable!.unsaved ? null : editable);
//     }
//   }

//   edit() {
//     this.$scope.form.pendingEdit = undefined;
//     this.$scope.form.editing = true;
//   }

//   isEditing(): boolean {
//     return this.$scope.form && this.$scope.form.editing;
//   }

//   canEdit(): boolean {
//     return !this.isEditing() && this.rights().edit();
//   }

//   getRemoveText(): string {
//     return 'Delete ' + this.getEditable()!.normalizedType;
//   }
// }


@Component({
  template: ''
})
export abstract class EditableEntityController<T extends EditableEntity> implements OnInit {

  editableInEdit: T | null = null;
  persisting: boolean;
  editableBefore: T | null = null;;

  @ViewChild(NgForm, {static: true}) public form: NgForm

  constructor(
    protected deleteConfirmationModal: DeleteConfirmationModal,
    private errorModal: ErrorModal,
    protected userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.loggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.cancelEditing();
      }
    });
  }

  ngDoCheck() {
    const editable = this.getEditable();
    if (editable !== this.editableBefore) {
      // The `getEditable` function has changed, perform your logic here
      // You can access the new editable item using `editable` variable

      this.editableBefore = editable; // Update the reference for future comparisons
      this.select(editable);
    }
  }

  abstract create(entity: T): Promise<any>;

  abstract update(entity: T, oldEntity: T): Promise<any>;

  abstract remove(entity: T): Promise<any>;

  abstract rights(): Rights;

  abstract getEditable(): T | null;

  abstract setEditable(editable: T | null): void;

  abstract getContext(): LanguageContext;

  abstract confirmChangeToRestrictedStatusDialog(entity: T, oldEntity: T): Promise<any> | null;

  abstract confirmDialog(entity: T, oldEntity: T): Promise<any> | null;

  select(editable: T | null) {
    this.setEditable(editable);
    this.editableInEdit = editable ? <T>editable.clone() : null;

    if (editable && editable.unsaved) {
      // XXX: prevent problems with unsaved navigation confirmation
      this.form.form.pendingEdit = true;
      setTimeout(() => this.edit());
    } else {
      this.cancelEditing();
    }
  }

  saveEdited() {

    const editable = this.getEditable();
    const editableInEdit = this.editableInEdit;

    const save = () => {
      this.persisting = true;

      (editable!.unsaved ? this.create(editableInEdit!) : this.update(editableInEdit!, editable!))
        .then(() => {
          this.select(editableInEdit);
          this.persisting = false;
        }, (err: any) => {
          if (err) {
            console.error(err);
            this.errorModal.openSubmitError((err.data && err.data.errorMessage) || 'Unexpected error');
          }
          this.persisting = false;
        });
    };

    const confirmAndSave = () => {
      const confirmDialog = this.confirmDialog(editableInEdit!, editable!);

      if (confirmDialog) {
        confirmDialog.then(() => save(), ignoreModalClose);
      } else {
        save();
      }
    };

    const confirmRestrictedStatusDialog = this.confirmChangeToRestrictedStatusDialog(editableInEdit!, editable!);

    if (confirmRestrictedStatusDialog) {
      confirmRestrictedStatusDialog.then(() => confirmAndSave(), ignoreModalClose);
    } else {
      confirmAndSave();
    }

  }

  openDeleteConfirmationModal(): Promise<void> {
    return this.deleteConfirmationModal.open(this.getEditable()!, this.getContext());
  }

  removeEdited(): void {
    const editable = this.getEditable();
    this.persisting = true;
    this.openDeleteConfirmationModal().then(() => this.remove(editable!)).then(() => {
      this.select(null);
      this.persisting = false;
    }, err => {
      if (!isModalCancel(err)) {
        console.error(err);
        this.errorModal.openSubmitError((err.data && err.data.errorMessage) || 'Unexpected error');
      }
      this.persisting = false;
    });
  }

  canRemove() {
    const editable = this.getEditable();
    return editable && !editable.unsaved && !this.isEditing() && this.rights().remove();
  }

  cancelEditing(): void {
    if (this.isEditing()) {
      this.form.form.editing = false;
      this.form.form.markAsPristine();
      const editable = this.getEditable();
      this.select(editable!.unsaved ? null : editable);
    }
  }

  edit(): void {
    this.form.form.pendingEdit = undefined;
    this.form.form.editing = true;
  }

  isEditing(): boolean {
    return this.form.form && this.form.form.editing;
  }

  canEdit(): boolean {
    return !this.isEditing() && this.rights().edit();
  }

  getRemoveText(): string {
    return `Delete ${ this.getEditable()!.normalizedType }`;
  }
}
