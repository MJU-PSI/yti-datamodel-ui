import { IRepeatScope, ITimeoutService } from 'angular';
import { scrollToElement } from 'app/utils/angular';
import { module as mod } from './module';

const selectionClass = 'selection';

mod.directive('keyControlSelection', ($timeout: ITimeoutService) => {
  return {
    restrict: 'A',
    link($scope: IRepeatScope, element: JQuery) {

      function findParent() {
        const parent = element.parent();
        if (parent.is('search-results')) {
          return parent.parent();
        } else {
          return parent;
        }
      }

      function update(selectionIndex: number) {
        if ($scope.$index === selectionIndex) {
          element.addClass(selectionClass);
          scrollToElement(element, findParent());
        } else {
          element.removeClass(selectionClass);
        }
      }

      $scope.$on('selectionMoved', (_event, selectionIndex) => update(selectionIndex));
      $scope.$on('selectionSelected', (_event, selectionIndex) => {
        if (selectionIndex === $scope.$index) {
          // do outside of digest cycle
          $timeout(() => element.click());
        }
      });
    }
  };
});
