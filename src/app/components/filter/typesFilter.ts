// import { SearchController, TextAnalysis } from 'app/types/filter';
// import { IScope } from 'angular';
// import { Type, WithIdAndType } from 'app/types/entity';
// import { containsAny } from '@mju-psi/yti-common-ui';
// import { ifChanged, LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     searchController: '='
//   },
//   template: `
//       <div class="form-check form-check-inline" ng-repeat="type in $ctrl.types">
//         <label class="form-check-label">
//           <input class="form-check-input" type="checkbox" checklist-model="$ctrl.searchTypes" checklist-value="type" /> {{type | translate}}
//         </label>
//       </div>
//   `
// })
// export class TypesFilterComponent {

//   searchController: SearchController<WithIdAndType>;

//   types: Type[] = ['model', 'class', 'shape', 'attribute', 'association'];
//   searchTypes: Type[] = this.types.slice();

//   constructor(private $scope: IScope) {
//     'ngInject';
//   }

//   $onInit() {

//     this.searchController.addFilter((item: TextAnalysis<WithIdAndType>) =>
//       containsAny(item.item.type, this.searchTypes)
//     );

//     this.$scope.$watchCollection(() => this.searchTypes, ifChanged(() => this.searchController.search()));
//   }
// }


import { Component, Input, OnInit } from '@angular/core';
import { SearchController, TextAnalysis } from 'app/types/filter';
import { Type, WithIdAndType } from 'app/types/entity';
import { containsAny } from '@mju-psi/yti-common-ui';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-types-filter',
  template: `
      <div class="form-check form-check-inline" *ngFor="let type of types">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" [(ngModel)]="searchTypes$" [ngValue]="type" /> {{type | translate}}
        </label>
      </div>
  `
})
export class TypesFilterComponent implements OnInit {

  @Input() searchController!: SearchController<WithIdAndType>;

  types: Type[] = ['model', 'class', 'shape', 'attribute', 'association'];
  private destroy$ = new Subject<void>();
  private searchTypes$ = new BehaviorSubject<Type[]>(this.types.slice());

  ngOnInit() {
    this.searchController.addFilter((item: TextAnalysis<WithIdAndType>) =>
      containsAny(item.item.type, this.searchTypes$.getValue())
    );

    this.searchTypes$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      tap(() => this.searchController.search())
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTypes$.complete();
  }

}
