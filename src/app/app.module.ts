import { NgModule, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import {
  AjaxLoadingIndicatorComponent,
  AjaxLoadingIndicatorSmallComponent, AlertModalService, AUTHENTICATED_USER_ENDPOINT, ConfirmationModalService, DropdownComponent, ErrorModalService, ExpandableTextComponent, FilterDropdownComponent, FooterComponent, Localizer as AngularLocalizer, LOCALIZER, LoginModalService, MenuComponent, ModalService, StatusComponent, YtiCommonModule,
  availableLanguages
} from '@mju-psi/yti-common-ui';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import enPo from 'raw-loader!po-loader?format=mf!../../po/en.po';
import fiPo from 'raw-loader!po-loader?format=mf!../../po/fi.po';
import svPo from 'raw-loader!po-loader?format=mf!../../po/sv.po';
import slPo from 'raw-loader!po-loader?format=mf!../../po/sl.po';
import { of } from 'rxjs';
// import {
//   ExportDirective,
//   HighlightDirective, ModelActionMenuDirective,
//   ModelLanguageChooserDirective,
//   ModelPageDirective,
//   ModelViewDirective, NewDatamodelVersionPrefixModalFormDirective, SortByColumnHeaderDirective
// } from './ajs-upgraded-components';
// import {
//   // OrganizationServiceWrapper,
//   authorizationManagerServiceProvider, configServiceProvider,
//   confirmationModalProvider, datamodelLocationServiceProvider,
//   displayItemFactoryProvider,
//   gettextCatalogProvider,
//   languageServiceProvider,
//   locationServiceProvider,
//   modelPageHelpServiceProvider,
//   modelServiceProvider,
//   notificationModalProvider,
//   // organizationServiceProvider,
//   routeServiceProvider,
//   scopeProvider,
//   showClassInfoModalProvider,
//   showPredicateInfoModalProvider,
//   userRoleServiceProvider
// } from './ajs-upgraded-providers';
import { SearchClassTableModalContentComponent } from './components/editor/searchClassTableModalContent';
import { SearchPredicateTableModalContentComponent } from './components/editor/searchPredicateTableModalContent';
import { UseContextInputComponent } from './components/form/use-context-input.component';
import { ModelDocumentationComponent } from './components/model-documentation/model-documentation.component';
import { MassMigrateDatamodelResourceStatusesModalComponent, MassMigrateDatamodelResourceStatusesModalService } from './components/model/mass-migrate-datamodel-resource-statuses-modal.component';
import { ModelMainComponent } from './components/model/modelMain';
import { NewDatamodelVersionModalComponent, NewDatamodelVersionModalService } from './components/model/new-datamodel-version-modal.component';
import { UseContextDropdownComponent } from './components/form/use-context-dropdown.component';
import { UserDetailsInformationComponent } from './components/userdetails/user-details-information.component';
import { UserDetailsSubscriptionsComponent } from './components/userdetails/user-details-subscriptions.component';
import { UserDetailsComponent } from './components/userdetails/user-details.component';
import { HelpService } from './help/providers/helpService';
import { apiEndpointWithName } from './services/config';
import { DatamodelConfirmationModalService } from './services/confirmation-modal.service';
import { IndexSearchService } from './services/indexSearchService';
import { DefaultAngularLocalizer, LanguageService } from './services/languageService';
import { MessagingService } from './services/messaging-service';
import fiCommonPo from 'raw-loader!po-loader?format=mf!../../node_modules/@mju-psi/yti-common-ui/po/fi.po';
import svCommonPo from 'raw-loader!po-loader?format=mf!../../node_modules/@mju-psi/yti-common-ui/po/sv.po';
import enCommonPo from 'raw-loader!po-loader?format=mf!../../node_modules/@mju-psi/yti-common-ui/po/en.po';
import slCommonPo from 'raw-loader!po-loader?format=mf!../../node_modules/@mju-psi/yti-common-ui/po/sl.po';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DefaultOrganizationService, ORGANIZATION_SERVICE } from './services/organizationService';
import { AppRoutingModule } from './app-routing.module';
import { LocationService } from './services/locationService';
import { ApplicationComponent } from './components/application';
import { IowComponentsNavigation } from './components/navigation/module';
import { NavigationBarComponent } from './components/navigation/navigation-bar.component';
import { BreadcrumbComponent } from './components/navigation/breadcrumb.component';
import { IowComponentsModule } from './components/module';
import { IowComponentsModelModule } from './components/model/module';
import { IowComponentsFormModule } from './components/form/module';
import { IowComponentsEditorModule } from './components/editor/module';
import { IowComponentsCommonModule } from './components/common/module';


// require('angular-gettext');
// require('checklist-model');
// require('ngclipboard');

function removeEmptyValues(obj: {}) {

  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!!value) {
      result[key] = value;
    }
  }

  return result;
}

// export const localizationStrings: { [key: string]: { [key: string]: string } } = {};

// for (const language of availableUILanguages) {
//   localizationStrings[language] = {
//     ...removeEmptyValues(JSON.parse(require(`raw-loader!po-loader?format=mf!../../po/${language}.po`))),
//     ...removeEmptyValues(JSON.parse(require(`raw-loader!po-loader?format=mf!yti-common-ui/po/${language}.po`)))
//   };
// }



export const localizationStrings: { [lang: string]: { [key: string]: string } } = {
  fi: {
    ...removeEmptyValues(JSON.parse(fiPo)),
    ...removeEmptyValues(JSON.parse(fiCommonPo))
  },
  sv: {
    ...removeEmptyValues(JSON.parse(svPo)),
    ...removeEmptyValues(JSON.parse(svCommonPo))
  },
  en: {
    ...removeEmptyValues(JSON.parse(enPo)),
    ...removeEmptyValues(JSON.parse(enCommonPo))
  },
  sl: {
    ...removeEmptyValues(JSON.parse(slPo)),
    ...removeEmptyValues(JSON.parse(slCommonPo))
  }
};

Object.freeze(localizationStrings);


export function resolveAuthenticatedUserEndpoint() {
  return apiEndpointWithName('user');
}

export function createTranslateLoader(): TranslateLoader {
  return { getTranslation: (lang: string) => of(localizationStrings[lang]) };
}

export function createMissingTranslationHandler(): MissingTranslationHandler {
  return {
    handle: (params: MissingTranslationHandlerParams) => {
      if (params.translateService.currentLang === 'en') {
        return params.key;
      } else {
        return '[MISSING]: ' + params.key;
      }
    }
  };
}

export function localizerFactory(languageService: LanguageService): AngularLocalizer {
  return new DefaultAngularLocalizer(languageService);
}


@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    YtiCommonModule,
    VirtualScrollerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useFactory: createMissingTranslationHandler }
    }),
    NgbModule,
    LMarkdownEditorModule, // markdown editor for use by ModelDocumentationComponent

    // new
    IowComponentsModule,
    IowComponentsModelModule,
    IowComponentsFormModule,
    IowComponentsCommonModule,
    // IowComponentsModelModule,
    // IowComponentsFormModule,
    // IowComponentsNavigation,
    // IowComponentsEditorModule,
    // IowComponentsCommonModule
  ],
  declarations: [
    // UseContextDropdownComponent,
    // UseContextInputComponent,
    // ModelMainComponent,
    // ModelPageDirective,
    // ModelViewDirective,
    // ModelLanguageChooserDirective,
    // ExportDirective,
    // ModelActionMenuDirective,
    // SortByColumnHeaderDirective,
    // HighlightDirective,
    // NewDatamodelVersionPrefixModalFormDirective,
    // SearchClassTableModalContentComponent,
    // SearchPredicateTableModalContentComponent,
    // UserDetailsComponent,
    // UserDetailsInformationComponent,
    // ApplicationComponent,
    // UserDetailsSubscriptionsComponent,
    // MassMigrateDatamodelResourceStatusesModalComponent,
    // NewDatamodelVersionModalComponent,
    // ModelDocumentationComponent,

    //new

  ],
  entryComponents: [],
  providers: [
    { provide: AUTHENTICATED_USER_ENDPOINT, useFactory: resolveAuthenticatedUserEndpoint },
    { provide: LOCALIZER, useFactory: localizerFactory, deps: [LanguageService] },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: ORGANIZATION_SERVICE, useClass: DefaultOrganizationService },
    { provide: Window, useValue: window },
    // languageServiceProvider,
    // scopeProvider,
    // routeServiceProvider,
    // locationServiceProvider,
    // modelServiceProvider,
    // notificationModalProvider,
    // confirmationModalProvider,
    // modelPageHelpServiceProvider,
    // gettextCatalogProvider,
    // displayItemFactoryProvider,
    // showClassInfoModalProvider,
    // showPredicateInfoModalProvider,
    // organizationServiceProvider,
    // userRoleServiceProvider,
    // configServiceProvider,
    // datamodelLocationServiceProvider,
    // authorizationManagerServiceProvider,
    LanguageService,
    LocationService,

    Title,
    HelpService,
    IndexSearchService,
    MessagingService,
    MassMigrateDatamodelResourceStatusesModalService,
    ModalService,
    AlertModalService,
    DatamodelConfirmationModalService,
    ErrorModalService,
    NewDatamodelVersionModalService,

    //new
    DefaultOrganizationService
  ],
  bootstrap: [ApplicationComponent]
})
export class AppModule {

}
