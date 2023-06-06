// import { LegacyComponent } from 'app/utils/angular';
// import { EditableForm } from 'app/components/form/editableEntityController';
// import { Model } from 'app/entities/model';

// @LegacyComponent({
//   bindings: {
//     model: '<',
//     saveNewVersion: '&',
//     close: '&'
//   },
//   template: `
//     <div class="modal-header">
//       <h4 class="modal-title strong">
//         <a><i id="close_modal_link" class="fa fa-times" ng-click="$ctrl.close()"></i></a>
//         <span translate>Create new version of datamodel</span>
//       </h4>
//     </div>
//     <div class="modal-body">
//       <form name="$ctrl.form" class="editable-form" implicit-edit-mode>
//           <p translate>Define prefix for the new version. Note that prefix is used to define the new namespace.</p>
//           <editable data-title="Prefix" context="$ctrl.model.context">
//             <input id="new_datamodel_version_prefix_input" class="form-control" type="text" prefix-input
//                     reserved-prefixes-getter="$ctrl.importedPrefixes"
//                     is-model-prefix='true'
//                     ng-model="$ctrl.prefix"
//                     autocomplete="off"
//                     required />
//           </editable>
//       </form>
//     </div>
//     <div class="modal-footer">
//       <div>
//         <button id="save_new_datamodel_version_button"
//                 ng-disabled="!$ctrl.canSave()"
//                 type="button"
//                 class="btn btn-action"
//                 ng-click="$ctrl.saveNewVersion($ctrl.prefix)"
//                 translate>Save</button>
//         <button id="cancel_new_datamodel_version_button" type="button" class="btn btn-link" ng-click="$ctrl.close()" translate>Cancel</button>
//       </div>
//     </div>
//   `
// })
// export class NewDatamodelVersionPrefixModalFormComponent {

//   model: Model;
//   saveNewVersion: (prefix: string) => void;
//   close: () => void;

//   importedPrefixes: () => string[];
//   form: EditableForm;

//   constructor() {

//     this.importedPrefixes = () => {
//       if (this.model.importedNamespaces) {
//         return this.model.importedNamespaces.map(ns => ns.prefix);
//       }
//       return [];
//     }
//   }

//   canSave() {
//     return this.form.$valid;
//   }
// }

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EditableForm } from 'app/components/form/editableEntityController';
import { Model } from 'app/entities/model';

@Component({
  selector: 'new-datamodel-version-prefix-modal-form',
  template: `
    <div class="modal-header">
      <h4 class="modal-title strong">
        <a><i id="close_modal_link" class="fa fa-times" (click)="close.emit()"></i></a>
        <span translate>Create new version of datamodel</span>
      </h4>
    </div>
    <div class="modal-body">
      <form #form="ngForm" name="form" class="editable-form" implicitEditMode="form">
          <p translate>Define prefix for the new version. Note that prefix is used to define the new namespace.</p>
          <editable [title]="'Prefix'" [context]="model.context" [form]="form">
            <input id="new_datamodel_version_prefix_input" class="form-control" type="text" prefixInput
                    [reservedPrefixesGetter]="importedPrefixes"
                    [isModelPrefix]="true"
                    [(ngModel)]="prefix"
                    autocomplete="off"
                    required
                    #editableInput/>
          </editable>
      </form>
    </div>
    <div class="modal-footer">
      <div>
        <button id="save_new_datamodel_version_button"
                [disabled]="!canSave()"
                type="button"
                class="btn btn-action"
                (click)="saveNewVersion.emit(prefix)"
                translate>Save</button>
        <button id="cancel_new_datamodel_version_button" type="button" class="btn btn-link" (click)="close.emit()" translate>Cancel</button>
      </div>
    </div>
  `
})
export class NewDatamodelVersionPrefixModalFormComponent {

  @Input() model: Model;
  prefix: string;

  @Output() saveNewVersion = new EventEmitter<string>();
  @Output() close = new EventEmitter();

  importedPrefixes: () => string[];
  form: NgForm;

  constructor() {
    this.importedPrefixes = () => {
      if (this.model.importedNamespaces) {
        return this.model.importedNamespaces.map(ns => ns.prefix);
      }
      return [];
    }
  }

  canSave() {
    return this.form.valid;
  }
}
