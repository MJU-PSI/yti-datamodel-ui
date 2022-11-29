import * as angular from 'angular';
import { ILocationService, IScope } from 'angular';
import { LanguageService } from 'app/services/languageService';
import { UserService } from 'app/services/userService';
import { LoginModalService, identity } from '@goraresult/yti-common-ui';
import { UILanguage } from 'app/types/language';
import { User } from 'app/entities/user';
import { HelpSelectionModal } from 'app/components/common/helpSelectionModal';
import { InteractiveHelp } from 'app/help/contract';
import { HelpProvider } from 'app/components/common/helpProvider';
import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';
import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';
import { ImpersonationService } from 'app/services/impersonationService';
import { ConfigService } from 'app/services/configService';
import { Config } from 'app/entities/config';
import { HelpService } from '../../help/providers/helpService';
import { Subscription } from 'rxjs';
import IInjectorService = angular.auto.IInjectorService;

// const logo = require('../../../assets/logo.svg');

@LegacyComponent({
  template: require('./navigationBar.html')
})
export class NavigationBarComponent {

  // logo = logo;

  availableLanguages = [
    { code: 'fi' as UILanguage, name: 'Suomeksi (FI)' },
    { code: 'sv' as UILanguage, name: 'På svenska (SV)' },
    { code: 'en' as UILanguage, name: 'In English (EN)' }
  ];

  helpProvider?: HelpProvider;

  fakeableUsers: { email: string, firstName: string, lastName: string }[] = [];
  config: Config;

  private subscriptions: Subscription[] = [];
  $injector: any;

  constructor($scope: IScope,
              $route: angular.route.IRouteService,
              $location: ILocationService,
              private languageService: LanguageService,
              private userService: UserService,
              impersonationService: ImpersonationService,
              private loginModal: LoginModalService,
              helpService: HelpService,
              private interactiveHelpService: InteractiveHelpService,
              private helpSelectionModal: HelpSelectionModal,
              configService: ConfigService,
              $injector: IInjectorService
              ) {
    'ngInject';

    this.$injector = $injector;
    impersonationService.getFakeableUsers()
      .then(users => this.fakeableUsers = users);

    this.subscriptions.push(helpService.helpProvider.subscribe(provider => this.helpProvider = provider));

    // TODO: The following, was under watching 'helps' source before refactoring
/*
      if ($route.current && $route.current!.params.hasOwnProperty('help')) {
        this.startHelp().then(() => {}, _err => {
          $location.search('help', null as any);
        });
      }
*/
    configService.getConfig()
      .then(config => this.config = config);
  }

  $onDestroy() {
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
    return this.userService.logout();
  }

  logIn() {
    const keycloak: any = this.$injector.get('keycloakService');
    keycloak.login();
  }

  canStartHelp() {
    return this.config && this.config.showIncompleteFeature && this.interactiveHelpService.isClosed() && this.helps.length > 0;
  }

  startHelp() {
    return this.helpSelectionModal.open(this.helps).then(identity, modalCancelHandler);
  }
}
