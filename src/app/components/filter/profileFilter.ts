// import { SearchController, TextAnalysis } from 'app/types/filter';
// import { IScope } from 'angular';
// import { WithDefinedBy } from 'app/types/entity';
// import { ifChanged, LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     searchController: '=',
//     onlySelection: '='
//   },
//   template: `
//       <div class="form-check form-check-inline" ng-hide="$ctrl.onlySelection">
//         <label>
//           <input type="checkbox" ng-model="$ctrl.showProfiles">
//           {{'Show classes defined in profiles' | translate}}
//         </label>
//       </div>
//   `
// })
// export class ProfileFilterComponent {

//   searchController: SearchController<WithDefinedBy>;
//   showProfiles = true;

//   constructor(private $scope: IScope) {
//     'ngInject';
//   }

//   $onInit() {

//     this.searchController.addFilter((item: TextAnalysis<WithDefinedBy>) =>
//       this.showProfiles || !item.item.definedBy.isOfType('profile')
//     );

//     this.$scope.$watch(() => this.showProfiles, ifChanged(() => this.searchController.search()));
//   }
// }


import { Component, Input, OnInit } from '@angular/core';
import { SearchController, TextAnalysis } from 'app/types/filter';
import { WithDefinedBy } from 'app/types/entity';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
selector: 'profile-filter',
template: `
  <div class="form-check form-check-inline" *ngIf="!onlySelection">
    <label>
      <input type="checkbox" [(ngModel)]="showProfiles">
      {{ 'Show classes defined in profiles' | translate }}
    </label>
  </div>
  `
})
export class ProfileFilterComponent implements OnInit {

  @Input() searchController!: SearchController<WithDefinedBy>;
  @Input() onlySelection!: boolean;

  showProfiles = true;

  ngOnInit() {
    this.searchController.addFilter((item: TextAnalysis<WithDefinedBy>) =>
      this.showProfiles || !item.item.definedBy.isOfType('profile')
    );

    this.showProfiles$().subscribe(() => {
      this.searchController.search();
    });
  }
  // TODO ALES - PREVERI
  showProfiles$() {
    return new Observable<boolean>((observer) => {
      observer.next(this.showProfiles);
    }).pipe(
      distinctUntilChanged(),
      debounceTime(200)
    );
  }
}
