import { module as mod } from './module';
import { SearchController, TextAnalysis } from 'app/types/filter';
import { IScope } from 'angular';
import { isDefined } from 'yti-common-ui/utils/object';
import { ifChanged } from 'app/utils/angular';
import { Type } from 'app/types/entity';
import * as _ from 'lodash';

mod.directive('typeFilter', () => {
  return {
    scope: {
      searchController: '=',
      label: '@',
      defaultType: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    restrict: 'E',
    template: `
            <div class="form-group">
              <label for="type">{{ctrl.label | translate}}</label>
              <div class="input-group input-group-md">
                  <select id="type" class="form-control" ng-model="ctrl.type" ng-options="type | translate for type in ctrl.types">
                    <option value="" translate>All types</option>
                  </select>
              </div>
            </div>
    `,
    controller: TypeFilterController
  };
});

interface WithNormalizedType {
  normalizedType: Type|null;
}

class TypeFilterController {

  searchController: SearchController<WithNormalizedType>;
  type: Type;
  defaultType: Type;
  types: Type[];
  label: string;

  /* @ngInject */
  constructor($scope: IScope) {

    $scope.$watch(() => this.searchController.items, ifChanged<WithNormalizedType[]>(items => {
      this.types = _.chain(items)
        .map(item => item.normalizedType!)
        .filter(type => isDefined(type))
        .uniq()
        .value();
    }));

    this.searchController.addFilter((item: TextAnalysis<WithNormalizedType>) =>
      !this.type || item.item.normalizedType === this.type
    );

    $scope.$watch(() => this.type, ifChanged(() => this.searchController.search()));
  }
}
