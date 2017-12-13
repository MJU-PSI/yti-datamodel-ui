import { module as mod } from './module';
import { LanguageService, localizationStrings } from '../../services/languageService';
import { UserService } from '../../services/userService';
import { LoginModal } from './loginModal';
import { availableUILanguages, UILanguage } from '../../utils/language';
import { User } from '../../entities/user';
import { config } from '../../../config';
import { HelpSelectionModal } from '../common/helpSelectionModal';
import { InteractiveHelp } from '../../help/contract';
import { HelpProvider } from '../common/helpProvider';
import { IScope, ILocationService, route } from 'angular';
import { InteractiveHelpService } from '../../help/services/interactiveHelpService';
import { identity } from '../../utils/function';
import { modalCancelHandler } from '../../utils/angular';

const logoImage = require('../../assets/logo-01.svg');

mod.directive('navigationBar', () => {
  return {
    restrict: 'E',
    template: require('./navigationBar.html'),
    scope: {
      helpProvider: '<'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: NavigationController
  };
});

class NavigationController {

  helpProvider: HelpProvider|null;

  languages: { code: UILanguage, name: string }[];
  helps: InteractiveHelp[];

  /* @ngInject */
  constructor($scope: IScope,
              $route: route.IRouteService,
              $location: ILocationService,
              private languageService: LanguageService,
              private userService: UserService,
              private loginModal: LoginModal,
              private interactiveHelpService: InteractiveHelpService,
              private helpSelectionModal: HelpSelectionModal) {

    this.languages = availableUILanguages.map(language => {
      const stringsForLang = localizationStrings[language];
      return { code: language, name: (stringsForLang && stringsForLang['In language']) || language };
    });

    const helps = () => this.helpProvider && this.helpProvider.helps || [];

    $scope.$watchCollection(helps, h => {
      this.helps = h;

      if ($route.current && $route.current!.params.hasOwnProperty('help')) {
        this.startHelp().then(() => {}, _err => {
          $location.search('help', null as any);
        });
      }
    });
  }

  get logoImage() {
    return logoImage;
  }

  get language(): UILanguage {
    return this.languageService.UILanguage;
  }

  set language(language: UILanguage) {
    this.languageService.UILanguage = language;
  }

  getUser(): User {
    return this.userService.user;
  }

  logout() {
    return this.userService.logout();
  }

  openLogin() {
    this.loginModal.open();
  }

  canStartHelp() {
    return this.interactiveHelpService.isClosed() && config.environment !== 'production' && this.helps.length > 0;
  }

  startHelp() {
    return this.helpSelectionModal.open(this.helps).then(identity, modalCancelHandler);
  }
}
