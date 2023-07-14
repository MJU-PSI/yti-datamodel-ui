// import { IScope } from 'angular';
// import { LanguageService } from 'app/services/languageService';
// import { ColumnDescriptor, TableDescriptor } from 'app/components/form/editableTable';
// import { SearchVocabularyModal } from './searchVocabularyModal';
// import { createExistsExclusion } from 'app/utils/exclusion';
// import { collectProperties } from '@mju-psi/yti-common-ui';
// import { Vocabulary } from 'app/entities/vocabulary';
// import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';
// import { LanguageContext } from 'app/types/language';
// import { EditableForm } from 'app/components/form/editableEntityController';
// import { TranslateService } from '@ngx-translate/core';
// import { DisplayItemFactory, Value } from 'app/components/form/displayItemFactory';

// interface WithVocabularies {
//   vocabularies: Vocabulary[];
//   addVocabulary(vocabulary: Vocabulary): void;
//   removeVocabulary(vocabulary: Vocabulary): void;
// }

// @LegacyComponent({
//   bindings: {
//     value: '=',
//     context: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: `
//       <h4>
//         <span translate>Terminologies</span>
//         <button id="add_vocabulary_button" type="button" class="btn btn-link btn-xs pull-right" ng-click="$ctrl.addVocabulary()" ng-show="$ctrl.isEditing()">
//           <span translate>Add vocabulary</span>
//         </button>
//       </h4>
//       <editable-table id="'vocabularies'" descriptor="$ctrl.descriptor" expanded="$ctrl.expanded"></editable-table>
//   `
// })
// export class VocabulariesViewComponent {

//   value: WithVocabularies;
//   context: LanguageContext;

//   descriptor: VocabularyTableDescriptor;
//   expanded: boolean;

//   form: EditableForm;

//   constructor(private $scope: IScope,
//               private searchVocabularyModal: SearchVocabularyModal,
//               private languageService: LanguageService,
//               private translateService: TranslateService,
//               private displayItemFactory: DisplayItemFactory) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.value, value => {
//       this.descriptor = new VocabularyTableDescriptor(value, this.context, this.languageService, this.translateService, this.displayItemFactory);
//     });
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   addVocabulary() {
//     const vocabularies = collectProperties(this.value.vocabularies, vocabulary => vocabulary.id.uri);
//     const exclude = createExistsExclusion(vocabularies);

//     this.searchVocabularyModal.open(this.context, exclude)
//       .then((vocabulary: Vocabulary) => {
//         this.value.addVocabulary(vocabulary);
//         this.expanded = true;
//       }, modalCancelHandler);
//   }
// }

// class VocabularyTableDescriptor extends TableDescriptor<Vocabulary> {

//   constructor(private value: WithVocabularies, private context: LanguageContext, private languageService: LanguageService, private translateService: TranslateService, private displayItemFactory: DisplayItemFactory) {
//     super();
//   }

//   columnDescriptors(): ColumnDescriptor<Vocabulary>[] {
//     return [
//       { headerName: 'Vocabulary name', nameExtractor: vocabulary => this.languageService.translate(vocabulary.title, this.context), hrefExtractor: vocabulary => vocabulary.id.uri },
//       { headerName: 'Status', nameExtractor: vocabulary => vocabulary.status ? this.translateService.instant(vocabulary.status) : '' },
//       { headerName: 'Modified at', nameExtractor: vocabulary => vocabulary.modifiedAt ? this.showItemValue(vocabulary.modifiedAt) : '' }
//     ];
//   }

//   values(): Vocabulary[] {
//     return this.value && this.value.vocabularies;
//   }

//   canEdit(_vocabulary: Vocabulary): boolean {
//     return false;
//   }

//   canRemove(vocabulary: Vocabulary): boolean {
//     return true;
//   }

//   remove(vocabulary: Vocabulary): any {
//     this.value.removeVocabulary(vocabulary);
//   }

//   orderBy(vocabulary: Vocabulary): any {
//     return vocabulary.id;
//   }

//   showItemValue(value: Value): string {
//     return this.displayItemFactory.create({
//       context: () => this.context,
//       value: () => value
//     }).displayValue;
//   }
// }

import { Component, Input } from '@angular/core';
import { LanguageService } from 'app/services/languageService';
import { ColumnDescriptor, TableDescriptor } from 'app/components/form/editableTable';
import { SearchVocabularyModal } from './searchVocabularyModal';
import { createExistsExclusion } from 'app/utils/exclusion';
import { collectProperties } from '@mju-psi/yti-common-ui';
import { Vocabulary } from 'app/entities/vocabulary';
import { LanguageContext } from 'app/types/language';
import { EditableForm } from 'app/components/form/editableEntityController';
import { TranslateService } from '@ngx-translate/core';
import { DisplayItemFactory, Value } from 'app/components/form/displayItemFactory';
import { NgForm } from '@angular/forms';
import { modalCancelHandler } from 'app/utils/angular';
import { EditableService } from 'app/services/editable.service';

interface WithVocabularies {
  vocabularies: Vocabulary[];
  addVocabulary(vocabulary: Vocabulary): void;
  removeVocabulary(vocabulary: Vocabulary): void;
}

@Component({
  selector: 'vocabularies-view',
  template: `
    <h4>
      <span translate>Terminologies</span>
      <button id="add_vocabulary_button" type="button" class="btn btn-link btn-xs pull-right" (click)="addVocabulary()" *ngIf="isEditing()">
        <span translate>Add vocabulary</span>
      </button>
    </h4>
    <editable-table [id]="'vocabularies'" [descriptor]="descriptor" [expanded]="expanded" ></editable-table>
  `
})
export class VocabulariesViewComponent {

  @Input() value: WithVocabularies;
  @Input() context: LanguageContext;

  descriptor: VocabularyTableDescriptor;
  expanded: boolean;

  constructor(
    private searchVocabularyModal: SearchVocabularyModal,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private displayItemFactory: DisplayItemFactory,
    private editableService: EditableService
  ) {}

  ngOnInit() {
    this.descriptor = new VocabularyTableDescriptor(
      this.value,
      this.context,
      this.languageService,
      this.translateService,
      this.displayItemFactory
    );
  }

  ngDoCheck() {
      this.descriptor = new VocabularyTableDescriptor(
        this.value,
        this.context,
        this.languageService,
        this.translateService,
        this.displayItemFactory
      );
  }

  isEditing() {
    return this.editableService.editing;
  }

  addVocabulary() {
    const vocabularies = collectProperties(
      this.value.vocabularies,
      (vocabulary) => vocabulary.id.uri
    );
    const exclude = createExistsExclusion(vocabularies);

    this.searchVocabularyModal
      .open(this.context, exclude)
      .then((vocabulary: Vocabulary) => {
        this.value.addVocabulary(vocabulary);
        this.expanded = true;
      }, modalCancelHandler);
  }
}

class VocabularyTableDescriptor extends TableDescriptor<Vocabulary> {

  constructor(
    private value: WithVocabularies,
    private context: LanguageContext,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private displayItemFactory: DisplayItemFactory
  ) {
    super();
  }

  columnDescriptors(): ColumnDescriptor<Vocabulary>[] {
    return [
      { headerName: 'Vocabulary name', nameExtractor: vocabulary => this.languageService.translate(vocabulary.title, this.context), hrefExtractor: vocabulary => vocabulary.id.uri },
      { headerName: 'Status', nameExtractor: vocabulary => vocabulary.status ? this.translateService.instant(vocabulary.status) : '' },
      { headerName: 'Modified at', nameExtractor: vocabulary => vocabulary.modifiedAt ? this.showItemValue(vocabulary.modifiedAt) : '' }
    ];
  }

  values(): Vocabulary[] {
    return this.value && this.value.vocabularies;
  }

  canEdit(_vocabulary: Vocabulary): boolean {
    return false;
  }

  canRemove(vocabulary: Vocabulary): boolean {
    return true;
  }

  remove(vocabulary: Vocabulary): any {
    this.value.removeVocabulary(vocabulary);
  }

  orderBy(vocabulary: Vocabulary): any {
    return vocabulary.id;
  }

  showItemValue(value: Value): string {
    return this.displayItemFactory.create({
      context: () => this.context,
      value: () => value
    }).displayValue;
  }
}
