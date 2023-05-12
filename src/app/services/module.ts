// import * as angular from 'angular';

// export const module10 = angular.module('iow.services', []);


import { NgModule } from '@angular/core';
import { ClassService, DefaultClassService } from './classService';
import { VocabularyService, DefaultVocabularyService } from './vocabularyService';
import { LanguageService } from './languageService';
import { LocationService } from './locationService';
import { DefaultModelService, ModelService } from './modelService';
import { DefaultVisualizationService, VisualizationService } from './visualizationService';
import { ReferenceDataService } from './referenceDataService';
import { PredicateService, DefaultPredicateService } from './predicateService';
import { SearchService } from './searchService';
import { UsageService } from './usageService';
import { DefaultValidatorService, ValidatorService } from './validatorService';
import { HistoryService } from './historyService';
import { EntityLoaderService } from './entityLoader';
import { ResetService } from './resetService';
import { SessionService } from './sessionService';
import { FrameService } from './frameService';
import { proxyToInstance } from 'app/utils/proxy';
import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';
import { InteractiveHelpValidatorService } from 'app/help/services/helpValidatorService';
import { UserService } from '@mju-psi/yti-common-ui';
import { downgradeInjectable } from '@angular/upgrade/static';
import { AuthorizationManagerService } from './authorizationManagerService';
import { ClassificationService } from './classificationService';
import { DefaultOrganizationService, OrganizationService } from './organizationService';
import { ImpersonationService } from './impersonationService';
import { ConfigService } from './configService';
import { UserRoleService } from './userRoleService';
import { InteractiveHelpOrganizationService } from 'app/help/services/helpOrganizationService';
import { EntityCreatorService } from 'app/help/services/entityCreatorService';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

function proxyConditionallyToHelp<T>(interactiveHelpService: InteractiveHelpService, defaultService: T, helpService: T) {
  return proxyToInstance(() => interactiveHelpService.isOpen() ? helpService : defaultService);
}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule
    // RouterModule
  ],
  providers: [
    DefaultClassService,
    // { provide: DefaultClassService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultClassService: ClassService, helpClassService: ClassService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultClassService, helpClassService);
    //   },
    //   deps: [InteractiveHelpService, DefaultClassService, DefaultClassService]
    // },
    DefaultVocabularyService,
    // { provide: DefaultVocabularyService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultVocabularyService: VocabularyService, helpVocabularyService: VocabularyService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultVocabularyService, helpVocabularyService);
    //   },
    //   deps: [InteractiveHelpService, DefaultVocabularyService, DefaultVocabularyService]
    // },
    LanguageService,
    LocationService,

    DefaultModelService,
    // { provide: DefaultModelService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultModelService: ModelService, helpModelService: ModelService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultModelService, helpModelService);
    //   },
    //   deps: [InteractiveHelpService, DefaultModelService, DefaultModelService]
    // },

    DefaultVisualizationService,
    // { provide: DefaultVisualizationService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultVisualizationService: DefaultVisualizationService, helpVisualizationService: DefaultVisualizationService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultVisualizationService, helpVisualizationService);
    //   },
    //   deps: [InteractiveHelpService, DefaultVisualizationService, DefaultVisualizationService]
    // },

    ReferenceDataService,

    DefaultPredicateService,
    // { provide: DefaultPredicateService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultPredicateService: DefaultPredicateService, helpPredicateService: DefaultPredicateService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultPredicateService, helpPredicateService);
    //   },
    //   deps: [InteractiveHelpService, DefaultPredicateService, DefaultPredicateService]
    // },

    SearchService,
    UsageService,

    UserService,
    // { provide: UserService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultUserService: UserService, helpUserService: UserService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultUserService, helpUserService);
    //   },
    //   deps: [InteractiveHelpService, UserService, UserService]
    // },

    DefaultValidatorService,
    // { provide: DefaultValidatorService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultValidatorService: DefaultValidatorService, helpValidatorService: DefaultValidatorService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultValidatorService, helpValidatorService);
    //   },
    //   deps: [InteractiveHelpService, DefaultValidatorService, DefaultValidatorService]
    // },
    DefaultOrganizationService,
    // { provide: DefaultOrganizationService,
    //   useFactory: (interactiveHelpService: InteractiveHelpService, defaultOrganizationService: DefaultOrganizationService, helpOrganizationService: DefaultOrganizationService) => {
    //     return proxyConditionallyToHelp(interactiveHelpService, defaultOrganizationService, helpOrganizationService);
    //   },
    //   deps: [InteractiveHelpService, DefaultOrganizationService, DefaultOrganizationService]
    // },
    HistoryService,
    ResetService,
    EntityLoaderService,
    // EntityCreatorService,  // TODO ALES
    SessionService,
    FrameService,
    AuthorizationManagerService,
    ClassificationService,
    ImpersonationService,
    ConfigService,
    UserRoleService
  ]
})
export class IowServicesModule  {}
