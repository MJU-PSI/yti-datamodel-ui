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

import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { SearchController, TextAnalysis } from 'app/types/filter';
import { isDefined } from '@mju-psi/yti-common-ui';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
        (ngModelChange)="onSearchTextChange($event)"
        [keyControl]="searchController.searchResults"
        ignoreDirty
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFilterComponent),
      multi: true
    }
  ]
})
export class TextFilterComponent<T> implements OnInit {
  @Input() placeholder: string;
  @Input() searchController: SearchController<T>;
  @Input() searchText: string;
  @Input() contentExtractors: string;

  @Output() searchTextChange: EventEmitter<string> = new EventEmitter<string>();

  modelChanged = new Subject<string>();

  constructor() {}

  ngOnInit() {
    this.searchController.addFilter((item: TextAnalysis<T>) => !this.searchText || isDefined(item.matchScore) || item.score < 2);

    this.modelChanged.pipe(debounceTime(500)).subscribe(() => {
      this.searchController.search();
    })
  }

  onSearchTextChange(value: string) {;
    this.modelChanged.next(value);
    this.searchTextChange.emit(value);
  }

}
