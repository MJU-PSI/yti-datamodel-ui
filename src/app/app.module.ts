import { NgModule, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { downgradeComponent, downgradeInjectable, UpgradeModule } from '@angular/upgrade/static';
import {
  AjaxLoadingIndicatorComponent,
  AjaxLoadingIndicatorSmallComponent, AlertModalService, AUTHENTICATED_USER_ENDPOINT, ConfirmationModalService, DropdownComponent, ErrorModalService, ExpandableTextComponent, FilterDropdownComponent, FooterComponent, Localizer as AngularLocalizer, LOCALIZER, LoginModalService, MenuComponent, ModalService, StatusComponent, YtiCommonModule
} from '@goraresult/yti-common-ui';
import * as angular from 'angular';
import { animate, ICompileProvider, ILocationProvider, ILogProvider, IHttpProvider } from 'angular';
import { ITooltipProvider } from 'angular-ui-bootstrap';
import { module9 as componentsModule } from './components';
import { module1 as commonModule } from './components/common';
import { module2 as editorModule } from './components/editor';
import { module8 as filterModule } from './components/filter';
import { module4 as formModule } from './components/form';
import { module7 as informationModule } from './components/information';
import { module5 as modelModule } from './components/model';
import { module6 as navigationModule } from './components/navigation';
import { module3 as visualizationModule } from './components/visualization';
import { module11 as helpModule } from './help';
import { routeConfig } from './routes';
import { module10 as servicesModule } from './services';

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
import { of } from 'rxjs';
import {
  ExportDirective,
  HighlightDirective, ModelActionMenuDirective,
  ModelLanguageChooserDirective,
  ModelPageDirective,
  ModelViewDirective, NewDatamodelVersionPrefixModalFormDirective, SortByColumnHeaderDirective
} from './ajs-upgraded-components';
import {
  authorizationManagerServiceProvider, configServiceProvider,
  confirmationModalProvider, datamodelLocationServiceProvider,
  displayItemFactoryProvider,
  gettextCatalogProvider,
  languageServiceProvider,
  locationServiceProvider,
  modelPageHelpServiceProvider,
  modelServiceProvider,
  notificationModalProvider,
  organizationServiceProvider,
  routeServiceProvider,
  scopeProvider,
  showClassInfoModalProvider,
  showPredicateInfoModalProvider,
  userRoleServiceProvider
} from './ajs-upgraded-providers';
import { SearchClassTableModalContentComponent } from './components/editor/searchClassTableModalContent';
import { SearchPredicateTableModalContentComponent } from './components/editor/searchPredicateTableModalContent';
import { UseContextInputComponent } from './components/form/use-context-input.component';
import { ModelDocumentationComponent } from './components/model-documentation/model-documentation.component';
import { MassMigrateDatamodelResourceStatusesModalComponent, MassMigrateDatamodelResourceStatusesModalService } from './components/model/mass-migrate-datamodel-resource-statuses-modal.component';
import { ModelMainComponent } from './components/model/modelMain';
import { NewDatamodelVersionModalComponent, NewDatamodelVersionModalService } from './components/model/new-datamodel-version-modal.component';
import { UseContextDropdownComponent } from './components/model/use-context-dropdown.component';
import { UserDetailsInformationComponent } from './components/userdetails/user-details-information.component';
import { UserDetailsSubscriptionsComponent } from './components/userdetails/user-details-subscriptions.component';
import { UserDetailsComponent } from './components/userdetails/user-details.component';
import { HelpService } from './help/providers/helpService';
import { apiEndpointWithName } from './services/config';
import { DatamodelConfirmationModalService } from './services/confirmation-modal.service';
import { IndexSearchService } from './services/indexSearchService';
import { DefaultAngularLocalizer, LanguageService } from './services/languageService';
import { MessagingService } from './services/messaging-service';
import { availableUILanguages } from './types/language';
import IAnimateProvider = animate.IAnimateProvider;
import fiCommonPo from 'raw-loader!po-loader?format=mf!../../node_modules/@goraresult/yti-common-ui/po/fi.po';
import svCommonPo from 'raw-loader!po-loader?format=mf!../../node_modules/@goraresult/yti-common-ui/po/sv.po';
import enCommonPo from 'raw-loader!po-loader?format=mf!../../node_modules/@goraresult/yti-common-ui/po/en.po';
import { environment } from '../environments/environment';
import { KeycloakService } from 'keycloak-angular';

require('angular-gettext');
require('checklist-model');
require('ngclipboard');

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
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UpgradeModule,
    YtiCommonModule.forRoot({
      url: environment.url,
      realm: environment.realm,
      clientId: environment.clientId
    }),
    VirtualScrollerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useFactory: createMissingTranslationHandler }
    }),
    NgbModule,
    LMarkdownEditorModule // markdown editor for use by ModelDocumentationComponent
  ],
  declarations: [
    UseContextDropdownComponent,
    UseContextInputComponent,
    ModelMainComponent,
    ModelPageDirective,
    ModelViewDirective,
    ModelLanguageChooserDirective,
    ExportDirective,
    ModelActionMenuDirective,
    SortByColumnHeaderDirective,
    HighlightDirective,
    NewDatamodelVersionPrefixModalFormDirective,
    SearchClassTableModalContentComponent,
    SearchPredicateTableModalContentComponent,
    UserDetailsComponent,
    UserDetailsInformationComponent,
    UserDetailsSubscriptionsComponent,
    MassMigrateDatamodelResourceStatusesModalComponent,
    NewDatamodelVersionModalComponent,
    ModelDocumentationComponent
  ],
  entryComponents: [],
  providers: [
    { provide: AUTHENTICATED_USER_ENDPOINT, useFactory: resolveAuthenticatedUserEndpoint },
    { provide: LOCALIZER, useFactory: localizerFactory, deps: [LanguageService] },
    languageServiceProvider,
    scopeProvider,
    routeServiceProvider,
    locationServiceProvider,
    modelServiceProvider,
    notificationModalProvider,
    confirmationModalProvider,
    modelPageHelpServiceProvider,
    gettextCatalogProvider,
    displayItemFactoryProvider,
    showClassInfoModalProvider,
    showPredicateInfoModalProvider,
    organizationServiceProvider,
    userRoleServiceProvider,
    configServiceProvider,
    datamodelLocationServiceProvider,
    authorizationManagerServiceProvider,
    Title,
    HelpService,
    IndexSearchService,
    MessagingService,
    MassMigrateDatamodelResourceStatusesModalService,
    ModalService,
    AlertModalService,
    DatamodelConfirmationModalService,
    ErrorModalService,
    NewDatamodelVersionModalService
  ]
})
export class AppModule {

  constructor(private upgrade: UpgradeModule) {
  }

  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ['iow-ui'], { strictDi: true });
  }
}

const mod = angular.module('iow-ui', [
  require('angular-animate'),
  require('angular-messages'),
  require('angular-route'),
  require('ui-bootstrap4'),
  'gettext',
  'checklist-model',
  'ngclipboard',
  commonModule.name,
  editorModule.name,
  visualizationModule.name,
  formModule.name,
  modelModule.name,
  navigationModule.name,
  informationModule.name,
  filterModule.name,
  componentsModule.name,
  servicesModule.name,
  helpModule.name
]);

mod.directive('appMenu', downgradeComponent({ component: MenuComponent }));
mod.directive('appFooter', downgradeComponent({
  component: FooterComponent,
  inputs: ['title'],
  outputs: ['informationClick']
}));

mod.directive('ajaxLoadingIndicator', downgradeComponent({ component: AjaxLoadingIndicatorComponent }));
mod.directive('ajaxLoadingIndicatorSmall', downgradeComponent({ component: AjaxLoadingIndicatorSmallComponent }));
mod.directive('appDropdown', downgradeComponent({ component: DropdownComponent }));
mod.directive('appExpandableText', downgradeComponent({ component: ExpandableTextComponent }));
mod.directive('appFilterDropdown', downgradeComponent({ component: FilterDropdownComponent }));
mod.directive('appStatus', downgradeComponent({ component: StatusComponent }));
mod.directive('appUseContextInput', downgradeComponent({ component: UseContextInputComponent }));
mod.directive('appSearchClassTableModalContent', downgradeComponent({ component: SearchClassTableModalContentComponent }));
mod.directive('appSearchPredicateTableModalContent', downgradeComponent({ component: SearchPredicateTableModalContentComponent }));
mod.directive('appUserDetails', downgradeComponent({ component: UserDetailsComponent }));
mod.directive('appUserDetailsInformation', downgradeComponent({ component: UserDetailsInformationComponent }));
mod.directive('appUserDetailsSubscriptions', downgradeComponent({ component: UserDetailsSubscriptionsComponent }));
mod.directive('appMassMigrateDatamodelResourceStatusesModalComponent', downgradeComponent({ component: MassMigrateDatamodelResourceStatusesModalComponent }));
mod.directive('appNewDatamodelVersionModalComponent', downgradeComponent({ component: NewDatamodelVersionModalComponent }));

mod.factory('translateService', downgradeInjectable(TranslateService));
mod.factory('loginModal', downgradeInjectable(LoginModalService));
mod.factory('localizationStrings', () => localizationStrings);
mod.factory('zone', downgradeInjectable(NgZone));
mod.factory('titleService', downgradeInjectable(Title));
mod.factory('helpService', downgradeInjectable(HelpService));
mod.factory('indexSearchService', downgradeInjectable(IndexSearchService));
mod.factory('messagingService', downgradeInjectable(MessagingService));
mod.factory('confirmationModalService', downgradeInjectable(ConfirmationModalService));
mod.factory('massMigrateDatamodelResourceStatusesModalService', downgradeInjectable(MassMigrateDatamodelResourceStatusesModalService));
mod.factory('modalService', downgradeInjectable(ModalService));
mod.factory('alertModalService', downgradeInjectable(AlertModalService));
mod.factory('datamodelConfirmationModalService', downgradeInjectable(DatamodelConfirmationModalService));
mod.factory('errorModalService', downgradeInjectable(ErrorModalService));
mod.factory('newDatamodelVersionModalService', downgradeInjectable(NewDatamodelVersionModalService));
mod.factory('keycloakService', downgradeInjectable(KeycloakService));

mod.config(routeConfig);

mod.config(($locationProvider: ILocationProvider,
            $logProvider: ILogProvider,
            $compileProvider: ICompileProvider,
            $animateProvider: IAnimateProvider,
            $uibTooltipProvider: ITooltipProvider,
            $httpProvider: IHttpProvider
            ) => {
  'ngInject';
  $locationProvider.html5Mode(true);
  $logProvider.debugEnabled(false);

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|https?|mailto):/);

  // enable angular-animate framework when 'ng-animate-enabled' class is added to animated element
  $animateProvider.classNameFilter(/ng-animate-enabled/);

  $uibTooltipProvider.options({ appendToBody: true });
  $uibTooltipProvider.setTriggers({ 'mouseenter': 'mouseleave click' });

  $httpProvider.interceptors.push(['$injector','$q',function ($injector, $q) {
    return {
      request: function (config) {
        const keycloakService = $injector.get('keycloakService');
        var deferred = $q.defer();
        try {
          keycloakService.getToken().then((token: string) => {
            if (config) {
              config.headers = config.headers || {};
              config.headers['Authorization'] = `Bearer ${token}`;
            }

            deferred.resolve(config);

          }).catch((err: any) => {
            deferred.resolve(config);
          })
        } catch(e){
          deferred.resolve(config);
        }

        return deferred.promise;
      }
    };
  }]);
});


mod.run((gettextCatalog: any) => {
  'ngInject';

  gettextCatalog.debug = true;

  for (const language of availableUILanguages) {
    gettextCatalog.setStrings(language, localizationStrings[language]);
  }
});
