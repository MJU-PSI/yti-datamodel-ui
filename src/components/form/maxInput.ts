import { IScope, IAttributes, INgModelController } from 'angular';
import { isDefined } from '../../utils/object';
import { module as mod } from './module';

mod.directive('maxInput', () => {
  return {
    scope: {
      min: '='
    },
    restrict: 'A',
    require: 'ngModel',
    link($scope: MaxInputScope, _element: JQuery, _attributes: IAttributes, modelController: INgModelController) {

      $scope.$watch(() => $scope.min, () => modelController.$validate());

      modelController.$validators['negative'] = (value: number) => {
        return !isDefined(value) || value >= 0;
      };
      modelController.$validators['lessThanMin'] = (value: number) => {
        return !isDefined(value) || !isDefined($scope.min) || value >= $scope.min;
      };
    }
  };
});

interface MaxInputScope extends IScope {
  min: number;
}
