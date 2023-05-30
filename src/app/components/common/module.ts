
// import * as angular from 'angular';
// export const module1 = angular.module('iow.components.common', []);

import { NgModule } from '@angular/core';
import { AccordionComponent, AccordionGroupComponent, AccordionTranscludeDirective } from './accordion';
import { AccordionChevronComponent } from './accordionChevron';
import { ButtonWithOptionsComponent } from './buttonWithOptions';
import { ClipboardComponent } from './clipboard';
import { ExportComponent } from './export';
import { ModelActionMenuComponent } from './modelActionMenu';
import { FloatDirective } from './float';
import { HighlightComponent } from './highlight';
import { ParagraphizeComponent, ParagraphizePipe } from './paragraphize';
import { TranslateValuePipe } from '../pipe/translate-value.pipe';
import { KeyControlDirective, KeyControlSelectionDirective } from './keyControl';
import { SearchResultContentDirective, SearchResultTranscludeDirective, SearchResultsComponent } from './searchResults';
import { CommonModule } from '@angular/common';
import { UsageComponent } from './usage.component';
import { UsagePanelComponent } from './usage-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIfBodyDirective } from './ngIfBody';
import { ConfirmationModal } from './confirmationModal';
import { DeleteConfirmationModal, DeleteConfirmationModalComponent } from './delete-confirmation-modal';
import { NotificationModal, NotificationModalComponent } from './notificationModal';
import { HelpSelectionModal, HelpSelectionModalComponent } from './helpSelectionModal';
import { TranslateLabelPipe } from '../pipe/translate-label.pipe';
import { CapitalizePipe } from '../pipe/capitalize.pipe';
import { TrustAsHtmlPipe } from '../pipe/trust-as-html.pipe';
import { LocalizedDatePipe } from '../pipe/localized-data.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderByPipe } from '../pipe/order-by.pipe';
import { FilterPipe } from '../pipe/filter.pipe';
import { OrderByFnPipe } from '../pipe/order-by-fn.pipe';
import { FilterFnPipe } from '../pipe/filter-fn.pipe';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxComponent } from './checkbox.component';
import { FormsModule } from '@angular/forms';
import { YtiCommonModule } from '@mju-psi/yti-common-ui';


@NgModule({
  declarations: [
    AccordionComponent,
    AccordionGroupComponent,
    AccordionTranscludeDirective,
    AccordionChevronComponent,
    ButtonWithOptionsComponent,
    ClipboardComponent,
    ExportComponent,
    ModelActionMenuComponent,
    FloatDirective,
    HighlightComponent,
    ParagraphizeComponent,
    ParagraphizePipe,
    TranslateValuePipe,
    KeyControlDirective,
    KeyControlSelectionDirective,
    SearchResultsComponent,
    SearchResultTranscludeDirective,
    SearchResultContentDirective,
    UsageComponent,
    UsagePanelComponent,
    NgIfBodyDirective,
    DeleteConfirmationModalComponent,
    NotificationModalComponent,
    HelpSelectionModalComponent,
    TranslateLabelPipe,
    CapitalizePipe,
    TrustAsHtmlPipe,
    LocalizedDatePipe,
    OrderByPipe,
    FilterPipe,
    OrderByFnPipe,
    FilterFnPipe,
    CheckboxGroupComponent,
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    YtiCommonModule
  ],
  providers: [
    ConfirmationModal,
    DeleteConfirmationModal,
    NotificationModal,
    HelpSelectionModal,
    TranslateValuePipe
  ],
  exports: [
    AccordionComponent,
    AccordionGroupComponent,
    AccordionTranscludeDirective,
    AccordionChevronComponent,
    ButtonWithOptionsComponent,
    ClipboardComponent,
    ExportComponent,
    ModelActionMenuComponent,
    FloatDirective,
    HighlightComponent,
    ParagraphizeComponent,
    ParagraphizePipe,
    TranslateValuePipe,
    KeyControlDirective,
    KeyControlSelectionDirective,
    SearchResultsComponent,
    SearchResultTranscludeDirective,
    SearchResultContentDirective,
    UsageComponent,
    UsagePanelComponent,
    NgIfBodyDirective,
    DeleteConfirmationModalComponent,
    NotificationModalComponent,
    HelpSelectionModalComponent,
    TranslateLabelPipe,
    CapitalizePipe,
    TrustAsHtmlPipe,
    LocalizedDatePipe,
    OrderByPipe,
    FilterPipe,
    OrderByFnPipe,
    FilterFnPipe,
    CheckboxGroupComponent,
    CheckboxComponent
  ]
})
export class IowComponentsCommonModule { }
