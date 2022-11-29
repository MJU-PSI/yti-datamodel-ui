import { INgModelController, IScope } from 'angular';
import { resolveValidator } from './validators';
import { normalizeAsArray } from '@goraresult/yti-common-ui';
import { dataTypes } from 'app/entities/dataTypes';
import { LegacyComponent } from 'app/utils/angular';

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

@LegacyComponent({
  template: require('./errorMessages.html'),
  bindings: {
    'ngModelController': '<'
  }
})
export class ErrorMessagesComponent {

  ngModelController: INgModelController|INgModelController[];
  ngModelControllers: INgModelController[];
  dynamicErrors = errors;

  constructor(private $scope: ErrorMessagesScope) {
    'ngInject';
  }

  isVisible() {
    if (this.ngModelControllers) {
      for (const ngModel of this.ngModelControllers) {
        if (ngModel.$dirty || ngModel.$viewValue) {
          return true;
        }
      }
    }
    return false;
  }

  $onInit() {
    this.$scope.$watch(() => this.ngModelController, (ngModelController: INgModelController|INgModelController[]) => {
      this.ngModelControllers = normalizeAsArray(ngModelController);
    });
  }
}

interface ErrorMessagesScope extends IScope {

  dynamicErrors: Error[];
  isVisible(): boolean;
}
