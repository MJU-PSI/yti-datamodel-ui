// import { SearchController, TextAnalysis } from 'app/types/filter';
// import { IScope } from 'angular';
// import { ifChanged, LegacyComponent } from 'app/utils/angular';
// import { isDefined } from '@mju-psi/yti-common-ui';

// @LegacyComponent({
//   bindings: {
//     searchText: '=',
//     contentExtractors: '=',
//     placeholder: '=',
//     searchController: '='
//   },
//   template: `
//           <div class="input-group input-group-lg input-group-search">
//             <input autofocus type="text" class="form-control" placeholder="{{$ctrl.placeholder | translate}}"
//                    autocomplete="off"
//                    id="text_filter_search_input"
//                    ng-model="$ctrl.searchText"
//                    ignore-dirty
//                    ng-model-options="{ debounce: { 'default': 500, 'blur': 0 } }"
//                    key-control="$ctrl.searchController.searchResults" />
//           </div>
//   `
// })
// export class TextFilterComponent<T> {

//   placeholder: string;
//   searchController: SearchController<T>;
//   searchText: string;

//   constructor(private $scope: IScope) {
//     'ngInject';
//   }

//   $onInit() {

//     this.searchController.addFilter((item: TextAnalysis<T>) => !this.searchText || isDefined(item.matchScore) || item.score < 2);

//     this.$scope.$watch(() => this.searchText, ifChanged(() => this.searchController.search()));
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { SearchController, TextAnalysis } from 'app/types/filter';
import { isDefined } from '@mju-psi/yti-common-ui';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'text-filter',
  template: `
    <div class="input-group input-group-lg input-group-search">
      <input
        type="text"
        class="form-control"
        placeholder="{{ placeholder | translate }}"
        autocomplete="off"
        id="text_filter_search_input"
        [(ngModel)]="searchText"
        (ngModelChange)="onSearchTextChange()"
        [keyControl]="searchController.searchResults"
        ignoreDirty
      />
    </div>
  `
})
export class TextFilterComponent<T> implements OnInit {
  @Input() placeholder: string;
  @Input() searchController: SearchController<T>;
  @Input() searchText: string;
  @Input() contentExtractors: string;

  modelChanged = new Subject<string>();

  constructor() {}

  ngOnInit() {
    this.searchController.addFilter((item: TextAnalysis<T>) => !this.searchText || isDefined(item.matchScore) || item.score < 2);

    this.modelChanged.pipe(debounceTime(500)).subscribe(() => {
      this.searchController.search();
    })
  }

  onSearchTextChange() {;
    this.modelChanged.next();
  }

}
