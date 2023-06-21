// import * as angular from 'angular';

// export const module4 = angular.module('iow.components.form', ['iow.services']);

import { NgModule } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { IowServicesModule } from "app/services/module";
import { EditableLabelComponent } from "./editableLabel";
import { EditableComponent } from "./editable";
import { ErrorMessagesComponent } from "./errorMessages";
import { NonEditableComponent } from "./non-editable";
import { AutocompleteComponent } from "./autocomplete";
import { BootstrapInputDirective } from "./bootstrapInput";
import { CodeValueInputDirective } from "./codeValueInput";
import { CodeValueInputAutocompleteComponent } from "./codeValueInputAutocomplete";
import { DataTypeInputDirective } from "./dataTypeInput";
import { DisplayItemFactory } from "./displayItemFactory";
import { DragSortableDirective, DragSortableItemDirective } from "./dragSortable";
import { EditableEntityButtonsComponent } from "./editableEntityButtons";
import { EditableTableComponent } from "./editableTable";
import { ErrorModal, ErrorModalContentComponent } from "./errorModal";
import { ExcludeValidatorDirective } from "./excludeValidator";
import { ErrorPanelComponent } from "./errorPanel";
import { HrefDirective } from "./href";
import { IdInputDirective } from "./idInput";
import { IgnoreDirtyDirective } from "./ignoreDirty";
import { IgnoreFormDirective } from "./ignoreForm";
import { ImplicitEditModeDirective } from "./implicitEditMode";
import { InputPopupComponent, InputPopupItemTranscludeDirective, InputPopupSelectItemDirective } from "./inputPopup";
import { IowSelectComponent } from "./iowSelect";
import { LanguageInputDirective } from "./languageInput";
import { LocalizedSelectComponent } from "./localizedSelect";
import { MaxInputDirective } from "./maxInput";
import { MinInputDirective } from "./minInput";
import { NamespaceInputDirective } from "./namespaceInput";
import { PrefixInputAsyncDirective, PrefixInputDirective } from "./prefixInput";
import { RestrictDuplicatesDirective } from "./restrictDuplicates";
import { SortByColumnHeaderComponent } from "./sortByColumnHeader";
import { UriInputDirective } from "./uriInput";
import { StringInputDirective } from "./stringInput";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { LanguageInputComponent } from "./language-input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UseContextInputComponent } from "./use-context-input.component";
import { UseContextDropdownComponent } from "./use-context-dropdown.component";
import { IowComponentsCommonModule } from "../common/module";
import { ModelLanguageChooserComponent } from "./modelLanguageChooser";
import { YtiCommonModule } from "@mju-psi/yti-common-ui";
import { LocalizedInputDirective } from "./localizedInput";
import { EditableStateSelectComponent } from "./editableStateSelect";

@NgModule({
  declarations: [
    AutocompleteComponent,
    BootstrapInputDirective,
    CodeValueInputDirective,
    CodeValueInputAutocompleteComponent,
    DataTypeInputDirective,
    DragSortableDirective,
    DragSortableItemDirective,
    EditableComponent,
    EditableEntityButtonsComponent,
    EditableLabelComponent,
    EditableTableComponent,
    ErrorMessagesComponent,
    ErrorPanelComponent,
    ExcludeValidatorDirective,
    HrefDirective,
    IdInputDirective,
    IgnoreDirtyDirective,
    IgnoreFormDirective,
    ImplicitEditModeDirective,
    InputPopupComponent,
    InputPopupSelectItemDirective,
    InputPopupItemTranscludeDirective,
    IowSelectComponent,
    LanguageInputDirective,
    LocalizedSelectComponent,
    MaxInputDirective,
    MinInputDirective,
    NamespaceInputDirective,
    NonEditableComponent,
    PrefixInputDirective,
    PrefixInputAsyncDirective,
    RestrictDuplicatesDirective,
    SortByColumnHeaderComponent,
    StringInputDirective,
    UriInputDirective,
    UseContextInputComponent,
    UseContextDropdownComponent,
    LanguageInputComponent,
    ModelLanguageChooserComponent,
    ErrorModalContentComponent,
    LocalizedInputDirective,
    EditableStateSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    YtiCommonModule,
    IowServicesModule,
    IowComponentsCommonModule
  ],
  providers: [
    DisplayItemFactory,
    ErrorModal,
    TranslateService
  ],
  exports: [
    AutocompleteComponent,
    BootstrapInputDirective,
    CodeValueInputDirective,
    CodeValueInputAutocompleteComponent,
    DataTypeInputDirective,
    DragSortableDirective,
    DragSortableItemDirective,
    EditableComponent,
    EditableEntityButtonsComponent,
    EditableLabelComponent,
    EditableTableComponent,
    ErrorMessagesComponent,
    ErrorPanelComponent,
    ExcludeValidatorDirective,
    HrefDirective,
    IdInputDirective,
    IgnoreDirtyDirective,
    IgnoreFormDirective,
    ImplicitEditModeDirective,
    InputPopupComponent,
    InputPopupSelectItemDirective,
    InputPopupItemTranscludeDirective,
    IowSelectComponent,
    LanguageInputDirective,
    LocalizedSelectComponent,
    MaxInputDirective,
    MinInputDirective,
    NamespaceInputDirective,
    NonEditableComponent,
    PrefixInputDirective,
    PrefixInputAsyncDirective,
    RestrictDuplicatesDirective,
    SortByColumnHeaderComponent,
    StringInputDirective,
    UriInputDirective,
    UseContextInputComponent,
    UseContextDropdownComponent,
    LanguageInputComponent,
    ModelLanguageChooserComponent,
    LocalizedInputDirective,
    EditableStateSelectComponent
  ]
})
export class IowComponentsFormModule { }
