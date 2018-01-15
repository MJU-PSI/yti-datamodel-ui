import { module as mod } from './module';
import { IScope, IAttributes, ITimeoutService } from 'angular';
import { hasLocalization } from 'app/utils/language';
import { Coordinate, Dimensions } from 'app/types/visualization';
import { Localizable } from 'yti-common-ui/types/localization';
import { LanguageContext } from 'app/types/language';

export interface VisualizationPopoverDetails {
  coordinate: Coordinate;
  heading: Localizable;
  comment: Localizable;
}

mod.directive('visualizationPopover', () => {
  return {
    scope: {
      details: '=',
      context: '='
    },
    restrict: 'E',
    bindToController: true,
    controllerAs: 'ctrl',
    controller: VisualizationPopoverController,
    template: `
       <div class="popover left" ng-style="ctrl.style">
         <div class="arrow"></div>
         <div class="popover-inner">
           <div class="popover-content">
             <h4>{{ctrl.details.heading | translateValue: ctrl.context}}</h4>
             <p>{{ctrl.details.comment | translateValue: ctrl.context}}</p>
           </div>
         </div>
       </div>
    `,
    require: 'visualizationPopover',
    link(_$scope: IScope, element: JQuery, _attributes: IAttributes, ctrl: VisualizationPopoverController) {

      const popoverElement = element.find('.popover');

      ctrl.getDimensions = () => {
        return {
          width: popoverElement.outerWidth(),
          height: popoverElement.outerHeight()
        };
      };
    }
  };
});

class VisualizationPopoverController {
  details: VisualizationPopoverDetails;
  context: LanguageContext;

  getDimensions: () => Dimensions;
  style: any = {};

  constructor($scope: IScope, $timeout: ITimeoutService) {
    $scope.$watch(() => this.details, details => {
      // Hide by keeping off screen absolute position
      this.style = { top: -10000 + 'px',  left: -10000 + 'px' };

      if (details && hasLocalization(details.comment)) {
        this.style.comment = details.comment;

        // Let the comment render before accessing calculated dimensions
        $timeout(() => {
          const dimensions = this.getDimensions();
          this.style.top = (details.coordinate.y - (dimensions.height / 2)) + 'px';
          this.style.left = (details.coordinate.x - dimensions.width - 15) + 'px';
        });
      }
    });
  }
}
