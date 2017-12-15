import { ILocationService, ui } from 'angular';
import IModalStackService = ui.bootstrap.IModalStackService;
import { createHelpWithDefaultHandler, InteractiveHelp, StoryLine } from './contract';
import { selectGroup } from './pages/frontPageHelp.po';
import * as GroupPage from './groupPageHelp';
import { KnownModelType } from 'app/types/entity';
import gettextCatalog = angular.gettext.gettextCatalog;

function createNewModel(type: KnownModelType, gettextCatalog: gettextCatalog): StoryLine {
  return {
    title: `Guide through creating new ${type}`,
    description: `Guide through creating new ${type} description`,
    items: () => [
      selectGroup,
      ...(type === 'profile' ? GroupPage.createNewProfileItems(gettextCatalog) : GroupPage.createNewLibraryItems(gettextCatalog)),
      GroupPage.finishedCreateNewModelNotification(type)
    ]
  };
}

export class FrontPageHelpService {

  /* @ngInject */
  constructor(private $uibModalStack: IModalStackService, private $location: ILocationService, private gettextCatalog: gettextCatalog) {
  }

  private returnToFrontPage() {
    this.$uibModalStack.dismissAll();
    this.$location.url('/');
  }

  getHelps(): InteractiveHelp[] {
    return [
      createHelpWithDefaultHandler(createNewModel('library', this.gettextCatalog), this.returnToFrontPage.bind(this)),
      createHelpWithDefaultHandler(createNewModel('profile', this.gettextCatalog), this.returnToFrontPage.bind(this))
    ];
  }
}
