import { LegacyComponent } from 'app/utils/angular';
import { Notification, Story } from 'app/help/contract';
import { IScope } from 'angular';
import { requireDefined } from '@mju-psi/yti-common-ui';
import { InteractiveHelpController } from './interactiveHelpDisplay';
import { elementPositioning, PopoverDimensionsProvider, resolveArrowClass } from 'app/help/utils/component';
import { gettextCatalog as GettextCatalog } from 'angular-gettext';

@LegacyComponent({
  bindings: {
    item: '<',
    helpController: '<'
  },
  template: `
        <span ng-class="$ctrl.arrowClass"></span>

        <div class="help-content-wrapper">
          <h3 ng-show="$ctrl.item.title">{{$ctrl.localizedTitle}}</h3>
          <p ng-show="$ctrl.item.content">{{$ctrl.localizedContent}}</p>
          <button ng-show="$ctrl.helpController.showPrevious" class="small button help-navigate" translate>previous</button>
          <button ng-show="$ctrl.helpController.showNext" class="small button help-navigate" translate>next</button>
          <button ng-show="$ctrl.helpController.showClose" class="small button help-next" translate>close</button>
          <a class="help-close">&times;</a>
        </div>
  `
})
export class InteractiveHelpPopoverDimensionsCalculatorComponent implements PopoverDimensionsProvider {

  item: Story|Notification;
  helpController: InteractiveHelpController;
  arrowClass: string[] = [];

  constructor(private $scope: IScope,
              private $element: JQuery,
              private gettextCatalog: GettextCatalog) {
    'ngInject';
  }

  $onInit() {
    this.helpController.registerPopoverDimensionsProvider(this);
    this.$scope.$watch(() => this.item, item => this.arrowClass = resolveArrowClass(item));
  }

  get localizedTitle() {
    if (this.item) {
      return this.gettextCatalog.getString(this.item.title.key, this.item.title.context);
    }  else {
      return '';
    }
  }

  get localizedContent() {
    if (this.item && this.item.content) {
      return this.gettextCatalog.getString(this.item.content.key, this.item.content.context);
    } else {
      return '';
    }
  }

  getDimensions(): { width: number; height: number } {
    return requireDefined(elementPositioning(this.$element));
  }
}
