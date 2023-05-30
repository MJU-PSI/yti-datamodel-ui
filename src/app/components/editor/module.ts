// import * as angular from 'angular';

// export const module2 = angular.module('iow.components.editor', ['iow.components.common', 'iow.components.form']);

import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AddPropertiesFromClassModal, AddPropertiesFromClassModalComponent } from "./add-properties-from-class-modal";
import { ChoosePredicateTypeModal, ChoosePredicateTypeModalComponent } from "./choose-predicate-type-modal";
import { FormsModule } from "@angular/forms";
import { IowComponentsFormModule } from "../form/module";
import { ClassFormComponent } from "./class-form";
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from "@angular/core";
import { CopyPredicateModalComponent, CopyPredicateModalService } from "./copy-predicate-modal";
import { IowComponentsCommonModule } from "../common/module";
import { EditableConstraintComponent } from "./editable-constraint";
import { EditableMultipleDataTypeInputComponent } from "./editable-multiple-data-type-input";
import { EditableMultipleLanguageSelectComponent } from "./editable-multiple-language-select";
import { EditableMultipleUriSelectComponent } from "./editable-multiple-uri-select";
import { EditableRangeSelectComponent } from "./editableRangeSelect";
import { EditableReferenceDataSelectComponent } from "./editableReferenceDataSelect";
import { PredicateFormComponent } from "./predicateForm";
import { PredicateViewComponent } from "./predicateView";
import { PropertyPredicateViewComponent } from "./propertyPredicateView";
import { PropertyViewComponent } from "./propertyView";
import { SearchClassModal } from "./searchClassModal";
import { SearchClassTableModal, SearchClassTableModalComponent } from "./searchClassTableModal";
import { SearchClassTableModalContentComponent } from "./searchClassTableModalContent";
import { SearchConceptModal, SearchConceptModalComponent } from "./searchConceptModal";
import { SearchPredicateController, SearchPredicateModal } from "./searchPredicateModal";
import { SearchPredicateTableModal } from "./searchPredicateTableModal";
import { SearchPredicateTableModalContentComponent } from "./searchPredicateTableModalContent";
import { SelectionViewComponent } from "./selectionView";
import { ShowPredicateInfoModal, ShowPredicateInfoModalComponent } from "./showPredicateInfoModal";
import { ShowClassInfoModal } from "./showClassInfoModal";
import { SubjectViewComponent } from "./subjectView";
import { VisualizationViewComponent } from "./visualizationView";
import { UriSelectComponent } from "./uriSelect";
import { DefaultClassService } from "app/services/classService";
import { EditableMultipleComponent } from "./editable-multiple";
import { IowComponentsFilterModule } from "../filter/module";


@NgModule({
  declarations: [
    AddPropertiesFromClassModalComponent,
    ChoosePredicateTypeModalComponent,
    ClassFormComponent,
    CopyPredicateModalComponent,
    EditableConstraintComponent,
    EditableMultipleComponent,
    EditableMultipleDataTypeInputComponent,
    EditableMultipleLanguageSelectComponent,
    EditableMultipleUriSelectComponent,
    EditableRangeSelectComponent,
    EditableReferenceDataSelectComponent,
    PredicateFormComponent,
    PredicateViewComponent,
    PropertyPredicateViewComponent,
    PropertyViewComponent,
    SearchClassTableModalContentComponent,
    SearchPredicateTableModalContentComponent,
    SelectionViewComponent,
    SubjectViewComponent,
    UriSelectComponent,
    VisualizationViewComponent,
    SearchClassTableModalComponent,
    ShowPredicateInfoModalComponent,
    SearchConceptModalComponent,
    SearchPredicateController
  ],
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    IowComponentsFormModule,
    IowComponentsCommonModule,
    IowComponentsFilterModule,
    NgbModule,
    TranslateModule
  ],
  providers: [
    AddPropertiesFromClassModal,
    ChoosePredicateTypeModal,
    NgbActiveModal,
    CopyPredicateModalService,
    SearchClassModal,
    SearchClassTableModal,
    SearchConceptModal,
    SearchPredicateModal,
    SearchPredicateTableModal,
    ShowClassInfoModal,
    ShowPredicateInfoModal,
    DefaultClassService,
  ],
  exports: [
    AddPropertiesFromClassModalComponent,
    ChoosePredicateTypeModalComponent,
    ClassFormComponent,
    CopyPredicateModalComponent,
    EditableConstraintComponent,
    EditableMultipleComponent,
    EditableMultipleDataTypeInputComponent,
    EditableMultipleLanguageSelectComponent,
    EditableMultipleUriSelectComponent,
    EditableRangeSelectComponent,
    EditableReferenceDataSelectComponent,
    PredicateFormComponent,
    PredicateViewComponent,
    PropertyPredicateViewComponent,
    PropertyViewComponent,
    SearchClassTableModalContentComponent,
    SearchPredicateTableModalContentComponent,
    SelectionViewComponent,
    SubjectViewComponent,
    UriSelectComponent,
    VisualizationViewComponent,
    SearchClassTableModalComponent
  ]
})
export class IowComponentsEditorModule { }
