import * as angular from 'angular';
import { ILocationService, IScope } from 'angular';
import { LanguageService } from 'app/services/languageService';
import { LoginModalService, identity, availableLanguages, UserService } from '@mju-psi/yti-common-ui';
import { UILanguage } from 'app/types/language';
import { User } from 'app/entities/user';
import { HelpSelectionModal } from 'app/components/common/helpSelectionModal';
import { InteractiveHelp } from 'app/help/contract';
import { HELP_PROVIDER, HelpProvider } from 'app/components/common/helpProvider';
import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';
import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';
import { ImpersonationService } from 'app/services/impersonationService';
import { ConfigService } from 'app/services/configService';
import { Config } from 'app/entities/config';
import { HelpService } from '../../help/providers/helpService';
import { Subscription } from 'rxjs';
import IInjectorService = angular.auto.IInjectorService;
import { Component, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { USER_SERVICE } from 'app/services/userService';


// // const logo = require('../../../assets/logo.svg');

// @LegacyComponent({
//   template: require('./navigationBar.html')
// })
// export class NavigationBarComponent {

//   // logo = logo;

//   availableLanguages: any;

//   helpProvider?: HelpProvider;

//   fakeableUsers: { email: string, firstName: string, lastName: string }[] = [];
//   config: Config;

//   private subscriptions: Subscription[] = [];
//   $injector: any;

//   constructor($scope: IScope,
//               $route: angular.route.IRouteService,
//               $location: ILocationService,
//               private languageService: LanguageService,
//               private userService: UserService,
//               impersonationService: ImpersonationService,
//               private loginModal: LoginModalService,
//               helpService: HelpService,
//               private interactiveHelpService: InteractiveHelpService,
//               private helpSelectionModal: HelpSelectionModal,
//               configService: ConfigService,
//               $injector: IInjectorService
//               ) {
//     'ngInject';

//     this.$injector = $injector;
//     this.availableLanguages = availableLanguages;
//     impersonationService.getFakeableUsers()
//       .then(users => this.fakeableUsers = users);

//     this.subscriptions.push(helpService.helpProvider.subscribe(provider => this.helpProvider = provider));

//     // TODO: The following, was under watching 'helps' source before refactoring
// /*
//       if ($route.current && $route.current!.params.hasOwnProperty('help')) {
//         this.startHelp().then(() => {}, _err => {
//           $location.search('help', null as any);
//         });
//       }
// */
//     configService.getConfig()
//       .then(config => this.config = config);
//   }

//   $onDestroy() {
//     this.subscriptions.forEach(s => s.unsubscribe());
//   }

//   get groupManagementUrl() {
//     return this.config && this.config.groupManagementUrl;
//   }

//   get terminologyUrl() {
//     return this.config && this.config.terminologyUrl;
//   }

//   get codeListUrl() {
//     return this.config && this.config.codeListUrl;
//   }

//   get commentsUrl() {
//     return this.config && this.config.commentsUrl;
//   }

//   get environmentIdentifier() {
//     return this.config ? this.config.getEnvironmentIdentifier('postfix') : '';
//   }

//   get language(): UILanguage {
//     return this.languageService.UILanguage;
//   }

//   set language(language: UILanguage) {
//     this.languageService.UILanguage = language;
//   }

//   get user(): User {
//     return this.userService.user;
//   }

//   get noMenuItemsAvailable() {
//     return !this.userService.isLoggedIn();
//   }

//   get helps(): InteractiveHelp[] {
//     if (this.helpProvider) {
//       return this.helpProvider.helps;
//     }
//     return [];
//   }

//   fakeUser(userEmail: string) {

//     this.userService.updateLoggedInUser(userEmail).then(() => {
//       window.location.reload();
//     }).catch(reason => console.error('Fake login failed: ' + reason));
//   }

//   isLoggedIn() {
//     return !this.user.anonymous;
//   }

//   showGroupManagementLink() {
//     return this.user.superuser || this.user.isInRoleInAnyOrganization('ADMIN');
//   }

//   logOut() {
//     const keycloak: any = this.$injector.get('keycloakService');
//     keycloak.logout();
//   }

//   logIn() {
//     const keycloak: any = this.$injector.get('keycloakService');
//     keycloak.login();
//   }

//   canStartHelp() {
//     return this.config && this.config.showIncompleteFeature && this.interactiveHelpService.isClosed() && this.helps.length > 0;
//   }

//   startHelp() {
//     return this.helpSelectionModal.open(this.helps).then(identity, modalCancelHandler);
//   }
// }



// const logo = require('../../../assets/logo.svg');

@Component({
  selector: 'navigation-bar',
  templateUrl: './navigation-bar.component.html',
  // providers:[UserService]
})
export class NavigationBarComponent implements OnDestroy {
  // logo = logo;
  availableLanguages: any = [];
  helpProvider?: HelpProvider;
  fakeableUsers: { email: string; firstName: string; lastName: string }[] = [];
  config: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private location: Location,
    private languageService: LanguageService,
    private userService: UserService,
    private impersonationService: ImpersonationService,
    // // @Inject(HELP_PROVIDER) private helpService: HelpProvider,
    // private interactiveHelpService: InteractiveHelpService,
    // private helpSelectionModal: HelpSelectionModal,
    private configService: ConfigService,
    private keycloakService: KeycloakService
  ) {
    this.availableLanguages = availableLanguages;
    this.impersonationService.getFakeableUsers().then(users => {
      this.fakeableUsers = users;
    });
    // TODO ALES
    // this.subscriptions.push(this.helpService.helpProvider.subscribe(provider => {
    //   this.helpProvider = provider;
    // }));
    // TODO: The following, was under watching 'helps' source before refactoring
    /*
    if ($route.current && $route.current!.params.hasOwnProperty('help')) {
      this.startHelp().then(() => {}, _err => {
        $location.search('help', null as any);
      });
    }
    */
    this.configService.getConfig().then(config => {
      this.config = config;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get groupManagementUrl() {
    return this.config && this.config.groupManagementUrl;
  }

  get terminologyUrl() {
    return this.config && this.config.terminologyUrl;
  }

  get codeListUrl() {
    return this.config && this.config.codeListUrl;
  }

  get commentsUrl() {
    return this.config && this.config.commentsUrl;
  }

  get environmentIdentifier() {
    return this.config ? this.config.getEnvironmentIdentifier('postfix') : '';
  }

  get language(): UILanguage {
    return this.languageService.UILanguage;
  }

  set language(language: UILanguage) {
    this.languageService.UILanguage = language;
  }

  get user(): User {
    return this.userService.user;
  }

  get noMenuItemsAvailable() {
    return !this.userService.isLoggedIn();
  }

  get helps(): InteractiveHelp[] {
    if (this.helpProvider) {
      return this.helpProvider.helps;
    }
    return [];
  }

  fakeUser(userEmail: string) {
    this.userService.updateLoggedInUser(userEmail).then(() => {
      window.location.reload();
    }).catch(reason => console.error('Fake login failed: ' + reason));
  }

  isLoggedIn() {
    return !this.user.anonymous;
  }

  showGroupManagementLink() {
    return this.user.superuser || this.user.isInRoleInAnyOrganization('ADMIN');
  }

  logOut() {
    this.keycloakService.logout();
  }

  logIn() {
    this.keycloakService.login();
  }

  canStartHelp() {
    // return this.config && this.config.showIncompleteFeature && this.interactiveHelpService.isClosed() && this.helps.length > 0;
  }

  startHelp() {
    // return this.helpSelectionModal.open(this.helps).then(identity, modalCancelHandler);
  }
}
