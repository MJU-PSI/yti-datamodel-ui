// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     value: '=',
//     values: '=',
//     id: '@',
//     displayNameFormatter: '='
//   },
//   template: `
//       <iow-select id="{{$ctrl.id}}" id-prefix="$ctrl.id" required ng-model="$ctrl.value" options="value in $ctrl.values">
//         <span>{{$ctrl.getName(value)}}</span>
//       </iow-select>
//   `
// })
// export class LocalizedSelectComponent {
//   value: string;
//   values: string[];
//   id: string;
//   displayNameFormatter: (value: string, gettextCatalog: GettextCatalog) => string;

//   constructor(private gettextCatalog: GettextCatalog) {
//     'ngInject';
//   }

//   getName(value: string) {
//     if (this.displayNameFormatter) {
//       return this.displayNameFormatter(value, this.gettextCatalog);
//     } else {
//       return this.gettextCatalog.getString(value);
//     }
//   }
// }

import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'localized-select',
  template: `
  <!-- TODO ALES -->
  iow-select todo
    <!-- <iow-select [id]="id" [idPrefix]="id" required [(ngModel)]="value" [options]="values">
      <span>{{ getName(value) }}</span>
    </iow-select> -->
  `
})
export class LocalizedSelectComponent {
  @Input() value: string;
  @Input() values: string[];
  @Input() id: string;
  @Input() displayNameFormatter: (value: string, translateService: TranslateService) => string;

  constructor(private translateService: TranslateService) {}

  getName(value: string) {
    if (this.displayNameFormatter) {
      return this.displayNameFormatter(value, this.translateService);
    } else {
      return this.translateService.instant(value);
    }
  }
}
