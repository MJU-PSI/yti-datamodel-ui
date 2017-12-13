import { IAttributes, INgModelController, IScope } from 'angular';
import { Uri } from '../../entities/uri';
import { contains, containsAny, flatten } from '../../utils/array';
import { referenceEquality } from '../../utils/object';
import { module as mod } from './module';

interface RestrictDuplicatesAttributes extends IAttributes {
  restrictDuplicates: string;
}

mod.directive('restrictDuplicates', () => {
  return {
    restrict: 'A',
    require: 'ngModel',
    link($scope: IScope, _element: JQuery, attributes: RestrictDuplicatesAttributes, ngModel: INgModelController) {

      ngModel.$validators['duplicate'] = value => {

        if (!value) {
          return true;
        }

        const restrictDuplicates = $scope.$eval(attributes.restrictDuplicates);

        if (typeof restrictDuplicates === 'function') {
          return !restrictDuplicates(value);
        } else {
          const valuesToCheckAgainst: any[] = restrictDuplicates;

          if (!valuesToCheckAgainst) {
            return true;
          }

          if ('localizedInput' in attributes) {
            const inputLocalizations = Object.values(value);
            const valuesToCheckAgainstLocalizations = flatten(valuesToCheckAgainst.map(v => Object.values(v)));
            return !containsAny(valuesToCheckAgainstLocalizations, inputLocalizations);
          } else {
            const equals = value instanceof Uri ? (lhs: Uri, rhs: Uri) => lhs.equals(rhs) : referenceEquality;
            return !contains(valuesToCheckAgainst, value, equals);
          }

        }
      };
    }
  };
});
