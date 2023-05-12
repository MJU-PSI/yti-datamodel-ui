// import * as angular from 'angular';


// export const module5 = angular.module('iow.components.model', ['iow.components.editor']);


import { NgModule } from "@angular/core";
import { IowComponentsEditorModule } from "../editor/module";
import { AddEditLinkModal, AddEditLinkModalComponent } from "./addEditLinkModal";
import { AddEditNamespaceModal } from "./addEditNamespaceModal";
import { ClassificationsViewComponent } from "./classificationsView";
import { ContributorsViewComponent } from "./contributorsView";
import { DividerComponent } from "./divider";
import { EditReferenceDataModal } from "./editReferenceDataModal";
import { ConceptFormComponent } from "./conceptForm";
import { ImportedNamespacesViewComponent } from "./importedNamespacesView";
import { LinksViewComponent } from "./linksView";
import { MassMigrateDatamodelResourceStatusesModalComponent } from "./mass-migrate-datamodel-resource-statuses-modal.component";
import { ModelFormComponent } from "./modelForm";
import { ModelMainComponent } from "./modelMain";
import { ModelPageComponent } from "./modelPage";
import { NewDatamodelVersionModalComponent, NewDatamodelVersionModalService } from "./new-datamodel-version-modal.component";
import { NewDatamodelVersionPrefixModalFormComponent } from "./newDatamodelVersionPrefixModalForm";
import { NewModelPageComponent } from "./newModelPage";
import { NonEditableVocabularyComponent } from "./nonEditableVocabulary";
import { ReferenceDatasViewComponent } from "./referenceDatasView";
import { ReferenceDataViewComponent } from "./referenceDataView";
import { SearchClassificationModal, SearchClassificationModalContent } from "./searchClassificationModal";
import { SearchNamespaceModal, SearchNamespaceModalComponent } from "./searchNamespaceModal";
import { SearchOrganizationModal, SearchOrganizationModalComponent } from "./searchOrganizationModal";
import { SearchReferenceDataModal, SearchReferenceDataModalComponent } from "./searchReferenceDataModal";
import { SearchVocabularyController, SearchVocabularyModal } from "./searchVocabularyModal";
import { TechnicalNamespacesComponent } from "./technicalNamespaces";
import { ViewReferenceDataModal } from "./viewReferenceDataModal";
import { VocabulariesViewComponent } from "./vocabulariesView";
import { DefaultModelService } from "app/services/modelService";
import { CommonModule } from "@angular/common";
import { YtiCommonModule } from "@mju-psi/yti-common-ui";
import { SubRoutingHackService } from "app/services/subRoutingHackService";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { IowComponentsFormModule } from "../form/module";
import { IowComponentsCommonModule } from "../common/module";
import { IowComponentsFilterModule } from "../filter/module";

@NgModule({
  declarations: [
    ClassificationsViewComponent,
    ContributorsViewComponent,
    ConceptFormComponent,
    DividerComponent,
    ImportedNamespacesViewComponent,
    LinksViewComponent,
    MassMigrateDatamodelResourceStatusesModalComponent,
    ModelFormComponent,
    ModelMainComponent,
    ModelPageComponent,
    NewDatamodelVersionModalComponent,
    NewDatamodelVersionPrefixModalFormComponent,
    NewModelPageComponent,
    NonEditableVocabularyComponent,
    ReferenceDatasViewComponent,
    ReferenceDataViewComponent,
    TechnicalNamespacesComponent,
    VocabulariesViewComponent,
    SearchClassificationModalContent,
    SearchOrganizationModalComponent,
    SearchVocabularyController,
    SearchReferenceDataModalComponent,
    AddEditLinkModalComponent,
    SearchNamespaceModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    YtiCommonModule,
    NgbModule,
    TranslateModule,
    IowComponentsEditorModule,
    IowComponentsFormModule,
    IowComponentsCommonModule,
    IowComponentsFilterModule
  ],
  providers: [
    AddEditLinkModal,
    AddEditNamespaceModal,
    EditReferenceDataModal,
    NewDatamodelVersionModalService,
    SearchClassificationModal,
    SearchNamespaceModal,
    SearchOrganizationModal,
    SearchReferenceDataModal,
    SearchVocabularyModal,
    SubRoutingHackService,
    ViewReferenceDataModal,
    DefaultModelService
  ],
  exports: [
    ClassificationsViewComponent,
    ContributorsViewComponent,
    ConceptFormComponent,
    DividerComponent,
    ImportedNamespacesViewComponent,
    LinksViewComponent,
    MassMigrateDatamodelResourceStatusesModalComponent,
    ModelFormComponent,
    ModelMainComponent,
    ModelPageComponent,
    NewDatamodelVersionModalComponent,
    NewDatamodelVersionPrefixModalFormComponent,
    NewModelPageComponent,
    NonEditableVocabularyComponent,
    ReferenceDatasViewComponent,
    ReferenceDataViewComponent,
    TechnicalNamespacesComponent,
    VocabulariesViewComponent
  ]
})
export class IowComponentsModelModule { }
