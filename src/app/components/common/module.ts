
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
import { HistoryComponent } from './history';
import { KeyControlDirective, KeyControlSelectionDirective } from './keyControl';
import { SearchResultTranscludeDirective, SearchResultsComponent } from './searchResults';
import { CommonModule } from '@angular/common';
import { UsageComponent } from './usage.component';
import { UsagePanelComponent } from './usage-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIfBodyDirective } from './ngIfBody';
import { ConfirmationModal } from './confirmationModal';
import { DeleteConfirmationModal, DeleteConfirmationModalComponent } from './delete-confirmation-modal';
import { HistoryModal, HistoryModalContentComponent } from './historyModal';
import { NotificationModal, NotificationModalComponent } from './notificationModal';
import { HelpSelectionModal, HelpSelectionModalComponent } from './helpSelectionModal';
import { TranslateLabelPipe } from '../pipe/translate-label.pipe';
import { CapitalizePipe } from '../pipe/capitalize.pipe';
import { TrustAsHtmlPipe } from '../pipe/trust-as-html.pipe';
import { LocalizedDatePipe } from '../pipe/localized-data.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderByPipe } from '../pipe/order-by.pipe';
import { FilterPipe } from '../pipe/filter.pipe';


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
    HistoryComponent,
    KeyControlDirective,
    KeyControlSelectionDirective,
    SearchResultsComponent,
    SearchResultTranscludeDirective,
    UsageComponent,
    UsagePanelComponent,
    NgIfBodyDirective,
    DeleteConfirmationModalComponent,
    HistoryModalContentComponent,
    NotificationModalComponent,
    HelpSelectionModalComponent,
    TranslateLabelPipe,
    CapitalizePipe,
    TrustAsHtmlPipe,
    LocalizedDatePipe,
    OrderByPipe,
    FilterPipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule
  ],
  providers: [
    ConfirmationModal,
    DeleteConfirmationModal,
    HistoryModal,
    NotificationModal,
    HelpSelectionModal
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
    HistoryComponent,
    KeyControlDirective,
    KeyControlSelectionDirective,
    SearchResultsComponent,
    SearchResultTranscludeDirective,
    UsageComponent,
    UsagePanelComponent,
    NgIfBodyDirective,
    DeleteConfirmationModalComponent,
    HistoryModalContentComponent,
    NotificationModalComponent,
    HelpSelectionModalComponent,
    TranslateLabelPipe,
    CapitalizePipe,
    TrustAsHtmlPipe,
    LocalizedDatePipe,
    OrderByPipe,
    FilterPipe
  ]
})
export class IowComponentsCommonModule { }
