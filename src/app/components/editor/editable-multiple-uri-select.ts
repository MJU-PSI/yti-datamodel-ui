// import { IPromise } from 'angular';
// import { SearchPredicateModal } from './searchPredicateModal';
// import { SearchClassModal, defaultTextForSelection } from './searchClassModal';
// import { Uri } from 'app/entities/uri';
// import { EditableForm } from 'app/components/form/editableEntityController';
// import { collectProperties } from '@mju-psi/yti-common-ui';
// import { createExistsExclusion } from 'app/utils/exclusion';
// import { DataSource } from 'app/components/form/dataSource';
// import { ClassService } from 'app/services/classService';
// import { PredicateService } from 'app/services/predicateService';
// import { ClassListItem } from 'app/entities/class';
// import { PredicateListItem } from 'app/entities/predicate';
// import { ClassType, KnownPredicateType } from 'app/types/entity';
// import { Model } from 'app/entities/model';
// import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';

// type DataType = ClassListItem|PredicateListItem;

// @LegacyComponent({
//   bindings: {
//     ngModel: '=',
//     type: '@',
//     model: '=',
//     id: '@',
//     title: '@',
//     customDataSource: '<',
//     requiredByInUse: '<'
//   },
//   require: {
//     form: '?^form'
//   },
//   template: `
//       <editable-multiple id="{{$ctrl.id + '_editable_multiple'}}" data-title="{{$ctrl.title}}" ng-model="$ctrl.ngModel" link="$ctrl.link" input="$ctrl.input">

//         <input-container>
//           <autocomplete datasource="$ctrl.datasource" value-extractor="$ctrl.valueExtractor" exclude-provider="$ctrl.createExclusion">
//             <input id="{{$ctrl.id + '_input'}}"
//                    type="text"
//                    restrict-duplicates="$ctrl.ngModel"
//                    uri-input
//                    ignore-form
//                    model="$ctrl.model"
//                    ng-model="$ctrl.input" />
//           </autocomplete>
//          </input-container>

//         <button-container>
//           <button id="{{$ctrl.id + '_choose_' + $ctrl.type + '_multiple_uri_select_button'}}"
//                   ng-if="$ctrl.isEditing()"
//                   type="button"
//                   class="btn btn-action btn-sm"
//                   style="display: block"
//                   ng-click="$ctrl.selectUri()">
//             {{('Choose ' + $ctrl.type) | translate}}
//           </button>
//         </button-container>

//       </editable-multiple>
//   `
// })
// export class EditableMultipleUriSelectComponent {

//   ngModel: Uri[];
//   input: Uri;
//   type: ClassType|KnownPredicateType;
//   model: Model;
//   id: string;
//   title: string;
//   customDataSource: DataSource<DataType>;
//   requiredByInUse: boolean;

//   addUri: (uri: Uri) => void;
//   datasource: DataSource<DataType>;
//   valueExtractor = (item: DataType) => item.id;

//   link = (uri: Uri) => this.model.linkToResource(uri);
//   createExclusion = () => createExistsExclusion(collectProperties(this.ngModel, uri => uri.uri));

//   form: EditableForm;

//   constructor(private searchPredicateModal: SearchPredicateModal,
//               private searchClassModal: SearchClassModal,
//               private classService: ClassService,
//               private predicateService: PredicateService) {
//     'ngInject';
//   }

//   $onInit() {
//     const modelProvider = () => this.model;
//     if (this.customDataSource) {
//       this.datasource = this.customDataSource;
//     } else {
//       this.datasource = this.type === 'class' ? this.classService.getClassesForModelDataSource(modelProvider, this.requiredByInUse)
//         : this.predicateService.getPredicatesForModelDataSource(modelProvider, this.requiredByInUse);
//     }
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   selectUri() {
//     let promise: IPromise<DataType>;
//     if (!this.customDataSource) {
//       promise = this.type === 'class' || this.type === 'shape'
//         ? this.searchClassModal.openWithOnlySelection(this.model, false, this.createExclusion(), defaultTextForSelection, this.requiredByInUse)
//         : this.searchPredicateModal.openWithOnlySelection(this.model, this.type, this.createExclusion(), this.requiredByInUse);
//     } else {
//       if (this.type === 'class' || this.type === 'shape') {
//         console.error('Custom data source for class selection dialog not yet supported');
//         return;
//       }
//       promise = this.searchPredicateModal.openWithCustomDataSource(this.model, this.type, this.customDataSource as DataSource<PredicateListItem>, this.createExclusion());
//     }

//     promise.then(result => {
//       this.ngModel.push(result.id);
//     }, modalCancelHandler);
//   }
// }

import { Component, Inject, Input, OnInit } from '@angular/core';
import { IPromise } from 'angular';
import { SearchPredicateModal } from './searchPredicateModal';
import { SearchClassModal } from './searchClassModal';
import { Uri } from 'app/entities/uri';
import { EditableForm } from 'app/components/form/editableEntityController';
import { collectProperties } from '@mju-psi/yti-common-ui';
import { createExistsExclusion } from 'app/utils/exclusion';
import { DataSource } from 'app/components/form/dataSource';
import { ClassService } from 'app/services/classService';
import { PredicateService } from 'app/services/predicateService';
import { ClassListItem } from 'app/entities/class';
import { PredicateListItem } from 'app/entities/predicate';
import { ClassType, KnownPredicateType } from 'app/types/entity';
import { Model } from 'app/entities/model';
import { modalCancelHandler } from 'app/utils/angular';

type DataType = ClassListItem|PredicateListItem;

@Component({
  selector: 'editable-multiple-uri-select',
  template: `
    <!-- <editable-multiple id="{{id + '_editable_multiple'}}" data-title="{{title}}" [(ngModel)]="ngModel" [link]="link" [input]="input">
      <input-container>
        <autocomplete [datasource]="datasource" [valueExtractor]="valueExtractor" [excludeProvider]="createExclusion">
          <input id="{{id + '_input'}}"
                 type="text"
                 restrict-duplicates="{{ngModel}}"
                 uri-input
                 ignore-form
                 [(ngModel)]="input"
                 [model]="model" />
        </autocomplete>
      </input-container>

      <button-container>
        <button id="{{id + '_choose_' + type + '_multiple_uri_select_button'}}"
                *ngIf="isEditing()"
                type="button"
                class="btn btn-action btn-sm"
                style="display: block"
                (click)="selectUri()">
          {{('Choose ' + type) | translate}}
        </button>
      </button-container>
    </editable-multiple> -->
  `
})
export class EditableMultipleUriSelectComponent implements OnInit {

  @Input() ngModel: Uri[];
  @Input() input: Uri;
  @Input() type: ClassType|KnownPredicateType;
  @Input() model: Model;
  @Input() id: string;
  @Input() title: string;
  @Input() customDataSource: DataSource<DataType>;
  @Input() requiredByInUse: boolean;

  addUri: (uri: Uri) => void;
  datasource: DataSource<DataType>;
  valueExtractor = (item: DataType) => item.id;

  link = (uri: Uri) => this.model.linkToResource(uri);
  createExclusion = () => createExistsExclusion(collectProperties(this.ngModel, uri => uri.uri));

  form: EditableForm;

  constructor(private searchPredicateModal: SearchPredicateModal,
              private searchClassModal: SearchClassModal,
              @Inject('classService') private classService: ClassService,
              @Inject('PredicateService') private predicateService: PredicateService) {}

  ngOnInit() {
    const modelProvider = () => this.model;
    if (this.customDataSource) {
      this.datasource = this.customDataSource;
    } else {
      this.datasource = this.type === 'class' ? this.classService.getClassesForModelDataSource(modelProvider, this.requiredByInUse)
        : this.predicateService.getPredicatesForModelDataSource(modelProvider, this.requiredByInUse);
    }
  }

  isEditing() {
    return this.form && this.form.editing;
  }

  selectUri() {
    let promise: Promise<DataType>;
    if (!this.customDataSource) {
      if (this.type === 'class' || this.type === 'shape') {
        // promise = this.searchClassModal.openWithOnlySelection(this.model, false, this.createExclusion(), defaultTextForSelection, this.requiredByInUse);
      } else {
        // promise = this.searchPredicateModal.openWithOnlySelection(this.model, this.type, this.createExclusion(), this.requiredByInUse);
      }
    } else {
      if (this.type === 'class' || this.type === 'shape') {
        console.error('Custom data source for class selection dialog not yet supported');
        return;
      }
      // promise = this.searchPredicateModal.openWithCustomDataSource(this.model, this.type, this.customDataSource as DataSource<PredicateListItem>, this.createExclusion());
    }

    // promise.then(result => {
    //   this.ngModel.push(result.id);
    // }).catch(modalCancelHandler);
  }

}
