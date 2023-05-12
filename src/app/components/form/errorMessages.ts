// import { INgModelController, IScope } from 'angular';
// import { resolveValidator } from './validators';
// import { normalizeAsArray } from '@mju-psi/yti-common-ui';
// import { dataTypes } from 'app/entities/dataTypes';
// import { LegacyComponent } from 'app/utils/angular';

// interface Error {
//   key: string;
//   message: string;
//   format?: string
// }

// const errors: Error[] = [];

// for (const dataType of dataTypes) {
//   const format = resolveValidator(dataType).format;
//   errors.push({ key: dataType, message: dataType + ' error', format: format ? `(${format})` : ''});
// }

// @LegacyComponent({
//   template: require('./errorMessages.html'),
//   bindings: {
//     'ngModelController': '<'
//   }
// })
// export class ErrorMessagesComponent {

//   ngModelController: INgModelController|INgModelController[];
//   ngModelControllers: INgModelController[];
//   dynamicErrors = errors;

//   constructor(private $scope: ErrorMessagesScope) {
//     'ngInject';
//   }

//   isVisible() {
//     if (this.ngModelControllers) {
//       for (const ngModel of this.ngModelControllers) {
//         if (ngModel.$dirty || ngModel.$viewValue) {
//           return true;
//         }
//       }
//     }
//     return false;
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.ngModelController, (ngModelController: INgModelController|INgModelController[]) => {
//       this.ngModelControllers = normalizeAsArray(ngModelController);
//     });
//   }
// }

// interface ErrorMessagesScope extends IScope {

//   dynamicErrors: Error[];
//   isVisible(): boolean;
// }

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgModel } from '@angular/forms';
import { resolveValidator } from './validators';
import { normalizeAsArray } from '@mju-psi/yti-common-ui';
import { dataTypes } from 'app/entities/dataTypes';

interface Error {
  key: string;
  message: string;
  format?: string
}

const errors: Error[] = [];

for (const dataType of dataTypes) {
  const format = resolveValidator(dataType).format;
  errors.push({ key: dataType, message: dataType + ' error', format: format ? `(${format})` : ''});
}

@Component({
  selector: 'error-messages',
  // template: `
  //   <ul *ngIf="isVisible()">
  //     <li *ngFor="let ngModel of ngModelControllers">
  //       <div *ngIf="ngModel.$dirty || ngModel.$touched || ngModel.errors">
  //         <div *ngFor="let error of ngModel.errors | keyvalue">
  //           <div *ngIf="!error.value.required && error.value">{{ error.key | translate }} {{ error.value | json }}</div>
  //           <div *ngIf="error.value.required">{{ error.key | translate }} {{ error.value.message }}</div>
  //         </div>
  //       </div>
  //     </li>
  //   </ul>
  // `
  templateUrl: './errorMessages.html',
})
export class ErrorMessagesComponent implements OnChanges {

  @Input() ngModelController: NgModel|NgModel[];
  ngModelControllers: NgModel[];
  dynamicErrors = errors;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ngModelController) {
      this.ngModelControllers = normalizeAsArray(this.ngModelController);
    }
  }

  isVisible() {
    if (this.ngModelControllers) {
      for (const ngModel of this.ngModelControllers) {
        if (ngModel.dirty  ) { //|| ngModel.touched || ngModel.errors
          return true;
        }
      }
    }
    return false;
  }
}
