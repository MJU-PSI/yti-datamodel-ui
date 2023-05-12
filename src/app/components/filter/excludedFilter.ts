// import { SearchController, TextAnalysis } from 'app/types/filter';
// import { IScope } from 'angular';
// import { Exclusion } from 'app/utils/exclusion';
// import { ifChanged, LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     searchController: '=',
//     exclude: '=',
//     searchText: '='
//   }
// })
// export class ExcludedFilterComponent<T> {

//   searchController: SearchController<T>;
//   searchText: string;
//   exclude: Exclusion<T>;

//   constructor(private $scope: IScope) {
//     'ngInject';
//   }

//   $onInit() {
//     this.searchController.addFilter((item: TextAnalysis<T>) =>
//       this.showExcluded || !this.exclude(item.item)
//     );

//     this.$scope.$watch(() => this.exclude, ifChanged(() => this.searchController.search()));
//   }

//   get showExcluded() {
//     return !!this.searchText;
//   }
// }

import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SearchController, TextAnalysis } from 'app/types/filter';
import { Exclusion } from 'app/utils/exclusion';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'excluded-filter',
  template: ''
})
export class ExcludedFilterComponent<T> implements OnInit {

  @Input() searchController: SearchController<T>;
  @Input() exclude: Exclusion<T>;
  @Input() searchText: string;
  excludeChanges$ = new Subject<Exclusion<T>>();

  constructor() { }

  ngOnInit() {
    this.searchController.addFilter((item: TextAnalysis<T>) =>
      this.showExcluded || !this.exclude(item.item)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.exclude) {
      this.searchController.search();
    }
  }

  get showExcluded(): boolean {
    return !!this.searchText;
  }
}
