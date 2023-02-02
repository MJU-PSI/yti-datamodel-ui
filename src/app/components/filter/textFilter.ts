import { SearchController, TextAnalysis } from 'app/types/filter';
import { IScope } from 'angular';
import { ifChanged, LegacyComponent } from 'app/utils/angular';
import { isDefined } from '@mju-psi/yti-common-ui';

@LegacyComponent({
  bindings: {
    searchText: '=',
    contentExtractors: '=',
    placeholder: '=',
    searchController: '='
  },
  template: `
          <div class="input-group input-group-lg input-group-search">
            <input autofocus type="text" class="form-control" placeholder="{{$ctrl.placeholder | translate}}"
                   autocomplete="off"
                   id="text_filter_search_input"
                   ng-model="$ctrl.searchText"
                   ignore-dirty
                   ng-model-options="{ debounce: { 'default': 500, 'blur': 0 } }"
                   key-control="$ctrl.searchController.searchResults" />
          </div>
  `
})
export class TextFilterComponent<T> {

  placeholder: string;
  searchController: SearchController<T>;
  searchText: string;

  constructor(private $scope: IScope) {
    'ngInject';
  }

  $onInit() {

    this.searchController.addFilter((item: TextAnalysis<T>) => !this.searchText || isDefined(item.matchScore) || item.score < 2);

    this.$scope.$watch(() => this.searchText, ifChanged(() => this.searchController.search()));
  }
}
