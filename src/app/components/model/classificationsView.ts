// import { IScope } from 'angular';
// import { LanguageService } from '../../services/languageService';
// import { ColumnDescriptor, TableDescriptor } from '../../components/form/editableTable';
// import { createExistsExclusion } from '../../utils/exclusion';
// import { collectProperties } from '@mju-psi/yti-common-ui';
// import { EditableForm } from '../../components/form/editableEntityController';
// import { Classification } from '../../entities/classification';
// import { SearchClassificationModal } from './searchClassificationModal';
// import { LegacyComponent, modalCancelHandler } from '../../utils/angular';

// interface WithClassifications {
//   classifications: Classification[];
//   addClassification(classification: Classification): void;
//   removeClassification(classification: Classification): void;
// }

// @LegacyComponent({
//   bindings: {
//     value: '=',
//     required: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: `
//       <h4>
//         <span translate>Classifications</span>
//         <button id="add_classification_button" type="button" class="btn btn-link btn-xs pull-right" ng-click="$ctrl.addClassification()" ng-show="$ctrl.isEditing()">
//           <span translate>Add classification</span>
//         </button>
//         <span ng-show="$ctrl.required && $ctrl.isEditing()" class="fas fa-asterisk" uib-tooltip="{{'Required' | translate}}"></span>
//       </h4>
//       <editable-table id="'classifications'" descriptor="$ctrl.descriptor" expanded="$ctrl.expanded"></editable-table>
//   `
// })
// export class ClassificationsViewComponent {

//   value: WithClassifications;

//   descriptor: ClassificationTableDescriptor;
//   expanded: boolean;

//   form: EditableForm;

//   constructor(private $scope: IScope,
//               private languageService: LanguageService,
//               private searchClassificationModal: SearchClassificationModal) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.value, value => {
//       this.descriptor = new ClassificationTableDescriptor(value, this.languageService);
//     });
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   addClassification() {

//     const classificationIds = collectProperties(this.value.classifications, c => c.id.uri);
//     const exclude = createExistsExclusion(classificationIds);

//     this.searchClassificationModal.open(exclude)
//       .then((classification: Classification) => {
//         this.value.addClassification(classification);
//         this.expanded = true;
//       }, modalCancelHandler);
//   }
// }

// class ClassificationTableDescriptor extends TableDescriptor<Classification> {

//   constructor(private value: WithClassifications, private languageService: LanguageService) {
//     super();
//   }

//   columnDescriptors(): ColumnDescriptor<Classification>[] {
//     return [
//       { headerName: 'Name', nameExtractor: c => this.languageService.translate(c.label) }
//     ];
//   }

//   values(): Classification[] {
//     return this.value && this.value.classifications;
//   }

//   canEdit(_classification: Classification): boolean {
//     return false;
//   }

//   canRemove(classification: Classification): boolean {
//     return this.value.classifications.length > 0;
//   }

//   remove(classification: Classification): any {
//     this.value.removeClassification(classification);
//   }

//   orderBy(c: Classification) {
//     return this.languageService.translate(c.label);
//   }
// }

import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { LanguageService } from '../../services/languageService';
import { ColumnDescriptor, TableDescriptor } from '../../components/form/editableTable';
import { createExistsExclusion } from '../../utils/exclusion';
import { collectProperties } from '@mju-psi/yti-common-ui';
import { EditableForm } from '../../components/form/editableEntityController';
import { Classification } from '../../entities/classification';
import { SearchClassificationModal } from './searchClassificationModal';
import { NgForm } from '@angular/forms';
import { modalCancelHandler } from '../../utils/angular';

interface WithClassifications {
  classifications: Classification[];
  addClassification(classification: Classification): void;
  removeClassification(classification: Classification): void;
}

@Component({
  selector: 'classifications-view',
  template: `
    <h4>
      <span translate>Classifications</span>
      <button id="add_classification_button" type="button" class="btn btn-link btn-xs pull-right" (click)="addClassification()" *ngIf="isEditing()">
        <span translate>Add classification</span >
      </button>
      <span *ngIf="required && isEditing()" class="fas fa-asterisk" [title]="'Required' | translate"></span >
    </h4>
    <editable-table id="classifications" [descriptor]="descriptor" [expanded]="expanded" [form]="form"></editable-table>
    `,
})
export class ClassificationsViewComponent implements OnInit {
  @Input() value: WithClassifications;
  @Input() required: boolean;
  @Input() form: NgForm;
  descriptor: ClassificationTableDescriptor;
  expanded: boolean;

  private prevValue: WithClassifications;

  constructor(
    private languageService: LanguageService,
    private searchClassificationModal: SearchClassificationModal
  ) { }

  ngOnInit() {
    this.descriptor = new ClassificationTableDescriptor(this.value, this.languageService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && !changes.value.firstChange) {
      const value = changes.value.currentValue;
      this.descriptor = new ClassificationTableDescriptor(value, this.languageService);
    }
  }

  ngDoCheck() {
    //  if (JSON.stringify(this.value) === JSON.stringify(this.prevValue)) {
    //   console.log('Classes are equal');
    // } else {
    //   console.log('Classes are not equal');
    //   this.prevValue = { ...this.value };
    //   this.descriptor = new ClassificationTableDescriptor(this.value, this.languageService);
    // }

    // TODO ALES - popravi da se kliče samo kadar se VALUE spremeni
    this.descriptor = new ClassificationTableDescriptor(this.value, this.languageService);
  }

  isEditing(): boolean {
    return this.form && this.form.form.editing;
  }

  addClassification(): void {
    const classificationIds = collectProperties(this.value.classifications, (c) => c.id.uri);
    const exclude = createExistsExclusion(classificationIds);

    this.searchClassificationModal.open(exclude).then(
      (classification: Classification) => {
        this.value.addClassification(classification);
        this.expanded = true;
      },
      modalCancelHandler
    );
  }
}

class ClassificationTableDescriptor extends TableDescriptor<Classification> {
  constructor(private value: WithClassifications, private languageService: LanguageService) {
    super();
  }

  columnDescriptors(): ColumnDescriptor<Classification>[] {
    return [{ headerName: 'Name', nameExtractor: (c) => this.languageService.translate(c.label) }];
  }

  values(): Classification[] {
    return this.value && this.value.classifications;
  }

  canEdit(_classification: Classification): boolean {
    return false;
  }

  canRemove(classification: Classification): boolean {
    return this.value.classifications.length > 0;
  }

  remove(classification: Classification): any {
    this.value.removeClassification(classification);
  }

  orderBy(c: Classification, c1: Classification): number {
    return this.languageService.translate(c.label).localeCompare(this.languageService.translate(c1.label));
  }
}
