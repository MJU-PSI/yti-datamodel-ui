import { IScope, IAttributes, ITranscludeFunction } from 'angular';
import { module as mod } from './module';
import { isDefined } from 'yti-common-ui/utils/object';

mod.directive('accordion', () => {
  return {
    scope: {
      openId: '=',
      animate: '='
    },
    controllerAs: 'ctrl',
    controller: AccordionController,
    bindToController: true,
    transclude: true,
    template: `
      <ng-transclude></ng-transclude>
    `
  };
});


class AccordionController {
  openId: any;
  animate: boolean;

  isOpen(id: any) {
    return this.openId === id;
  }

  toggleVisibility(id: any) {
    if (this.isOpen(id)) {
      this.openId = null;
    } else {
      this.openId = id;
    }
  }
}

mod.directive('accordionGroup', () => {
  return {
    scope: {
      identifier: '='
    },
    restrict: 'E',
    transclude: {
      heading: 'accordionHeading',
      body: 'accordionBody'
    },
    template: `
      <div class="card" ng-class="{ show: isOpen() }">
        <div class="card-header" ng-click="toggleVisibility()">
          <div accordion-transclude="heading" is-open="isOpen"></div>
        </div>
        <div uib-collapse="!isOpen()" ng-if="isAnimate()">
          <div class="card-body" ng-class="{ show: isOpen }">
            <div accordion-transclude="body" is-open="isOpen"></div>
          </div>
        </div>
        <divc class="collapse" ng-show="isOpen()" ng-if="!isAnimate()">
          <div class="card-body">
            <div accordion-transclude="body" is-open="isOpen"></div>
          </div>
        </divc>
      </div>
    `,
    require: '^accordion',
    link: {
      pre($scope: AccordionGroupScope, _element: JQuery, _attributes: IAttributes, accordionController: AccordionController) {
        $scope.isOpen = () => accordionController.isOpen($scope.identifier);
        $scope.toggleVisibility = () => accordionController.toggleVisibility($scope.identifier);
        $scope.isAnimate = () => isDefined(accordionController.animate) ? accordionController.animate : true;
      }
    }
  };
});

interface AccordionGroupScope extends IScope {
  identifier: any;
  isOpen: () => boolean;
  toggleVisibility: () => void;
  isAnimate(): boolean;
}

interface AccordionTranscludeAttributes extends IAttributes {
  accordionTransclude: 'heading' | 'body';
  isOpen: string;
}

interface AccordionTranscludeScope extends IScope {
  isOpen: () => boolean;
}

mod.directive('accordionTransclude', () => {
  return {
    restrict: 'A',
    link($scope: AccordionGroupScope, element: JQuery, attributes: AccordionTranscludeAttributes, _controller: any, transclude: ITranscludeFunction) {
      function ngTranscludeCloneAttachFn(clone: JQuery, transcludeScope: AccordionTranscludeScope) {
        element.append(clone);
        transcludeScope.isOpen = $scope.$eval(attributes.isOpen);
      }
      const slotName = attributes.accordionTransclude;
      transclude(ngTranscludeCloneAttachFn, null, slotName);
    }
  };
});
