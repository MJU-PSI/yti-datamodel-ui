// import { SearchController, TextAnalysis } from '../../types/filter';
// import { IScope } from 'angular';
// import { isDefined } from '@mju-psi/yti-common-ui';
// import { ifChanged, LegacyComponent } from '../../utils/angular';
// import { Type } from '../../types/entity';
// import * as _ from 'lodash';

// interface WithNormalizedType {
//   normalizedType: Type|null;
// }

// @LegacyComponent({
//   bindings: {
//     searchController: '=',
//     label: '@',
//     defaultType: '='
//   },
//   template: `
//       <select id="type"
//               class="form-control"
//               style="width: auto"
//               ng-model="$ctrl.type"
//               ng-options="type | translate for type in $ctrl.types">
//         <option value="" translate>All types</option>
//       </select>
//   `
// })
// export class TypeFilterComponent {

//   searchController: SearchController<WithNormalizedType>;
//   type: Type;
//   defaultType: Type;
//   types: Type[];
//   label: string;

//   constructor(private $scope: IScope) {
//     'ngInject';
//   }

//   $onInit() {

//     if (!!this.defaultType) {
//       this.type = this.defaultType;
//     }

//     this.$scope.$watch(() => this.searchController.items, ifChanged<WithNormalizedType[]>(items => {
//       this.types = _.chain(items)
//         .map(item => item.normalizedType!)
//         .filter(type => isDefined(type))
//         .uniq()
//         .value();
//     }));

//     this.searchController.addFilter((item: TextAnalysis<WithNormalizedType>) =>
//       !this.type || item.item.normalizedType === this.type
//     );

//     this.$scope.$watch(() => this.type, ifChanged(() => this.searchController.search()));
//   }
// }


import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SearchController, TextAnalysis } from '../../types/filter';
import { isDefined } from '@mju-psi/yti-common-ui';
import { ifChanged } from '../../utils/angular';
import { Type } from '../../types/entity';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface WithNormalizedType {
  normalizedType: Type | null;
}

@Component({
  selector: 'app-type-filter',
  template: `
      <select #typeSelect
              id="type"
              class="form-control"
              style="width: auto"
              [(ngModel)]="type">
        <option value="" translate>All types</option>
        <option *ngFor="let type of types" [value]="type">{{ type | translate }}</option>
      </select>
  `
})
export class TypeFilterComponent implements OnInit, OnDestroy {

  @Input() searchController: SearchController<WithNormalizedType>;
  @Input() label: string;
  @Input() defaultType: Type;

  @ViewChild('typeSelect') typeSelect: any;

  type: Type;
  types: Type[];
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    if (!!this.defaultType) {
      this.type = this.defaultType;
    }

    // TODO ALES - PREVERI
    // this.searchController.items$
    //   .pipe(
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(items => {
    //     this.types = _.chain(items)
    //       .map(item => item.normalizedType!)
    //       .filter(type => isDefined(type))
    //       .uniq()
    //       .value();
    //   });

    this.searchController.addFilter((item: TextAnalysis<WithNormalizedType>) =>
      !this.type || item.item.normalizedType === this.type
    );

    this.typeSelect.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.searchController.search());
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
