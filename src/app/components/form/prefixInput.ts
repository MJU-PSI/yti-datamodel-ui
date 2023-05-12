// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';
// import { isValidPrefix, isValidPrefixLength } from './validators';
// import { ImportedNamespace, Model, NamespaceType } from 'app/entities/model';
// import { ValidatorService } from 'app/services/validatorService';

// interface PrefixInputScope extends IScope {
//   model: Model;
//   activeNamespace: ImportedNamespace;
//   allowTechnical: boolean;
//   reservedPrefixes?: string[];
//   reservedPrefixesGetter?: () => string[];
//   isModelPrefix?: boolean;
// }

// export const PrefixInputDirective: IDirectiveFactory = (validatorService: ValidatorService) => {
//   'ngInject';
//   return {
//     scope: {
//       model: '=?',
//       activeNamespace: '=?',
//       allowTechnical: '=?',
//       reservedPrefixes: '=?',
//       reservedPrefixesGetter: '=?',
//       isModelPrefix: '=?'
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: PrefixInputScope, _element: JQuery, _attributes: IAttributes, ngModel: INgModelController) {
//       ngModel.$validators['prefix'] = isValidPrefix;
//       ngModel.$validators['length'] = isValidPrefixLength;
//       ngModel.$validators['existingOrReservedId'] = (prefix: string) => {

//         const model = $scope.model;
//         const activeNamespace = $scope.activeNamespace;
//         const allowTechnical = $scope.allowTechnical;
//         const reservedPrefixes: string[] = $scope.reservedPrefixes || ($scope.reservedPrefixesGetter ? $scope.reservedPrefixesGetter() : []);

//         if (reservedPrefixes.includes(prefix) && prefix !== '') {
//           return false;
//         }

//         if (!model) {
//           return true;
//         } else {
//           for (const modelNamespace of model.getNamespaces()) {
//             if (modelNamespace.prefix === prefix) {

//               const isTechnical = modelNamespace.namespaceType === NamespaceType.IMPLICIT_TECHNICAL;
//               const isActiveNamespace = activeNamespace ? activeNamespace.prefix === modelNamespace.prefix : false;

//               if (isTechnical && allowTechnical) {
//                 return true;
//               } else {
//                 return isActiveNamespace;
//               }
//             }
//           }
//           return true;
//         }
//       };

//       const isModelPrefix = $scope.isModelPrefix;

//       if (isModelPrefix) {
//         ngModel.$asyncValidators['existingId'] = (prefix: string) => {
//           return validatorService.prefixDoesNotExists(prefix);
//         };
//       }
//     }
//   };
// };

import { Directive, Input } from '@angular/core';
import { ValidatorFn, NG_VALIDATORS, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors, Validator, AsyncValidator } from '@angular/forms';
import { Model, ImportedNamespace, NamespaceType } from 'app/entities/model';
import { isValidPrefix, isValidPrefixLength } from './validators';
import { DefaultValidatorService } from 'app/services/validatorService';
import { Observable } from 'rxjs';

interface PrefixInputScope {
  model: Model;
  activeNamespace: ImportedNamespace;
  allowTechnical: boolean;
  reservedPrefixes?: string[];
  reservedPrefixesGetter?: () => string[];
  isModelPrefix?: boolean;
}

@Directive({
  selector: '[prefixInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PrefixInputDirective,
      multi: true,
    },
  ],
})
export class PrefixInputDirective implements Validator {
  @Input() model?: Model;
  @Input() activeNamespace?: ImportedNamespace;
  @Input() allowTechnical?: boolean;
  @Input() reservedPrefixes?: string[];
  @Input() reservedPrefixesGetter?: () => string[];
  @Input() isModelPrefix?: boolean;

  constructor(private validatorService: DefaultValidatorService) {}

  validate(control: AbstractControl):  ValidationErrors | null {
    const prefix = control.value as string;
    const reservedPrefixes = this.reservedPrefixes || (this.reservedPrefixesGetter ? this.reservedPrefixesGetter() : []);

    const validators: { [key: string]: ValidatorFn } = {
      prefix: isValidPrefix,
      length: isValidPrefixLength,
      existingOrReservedId: (control: AbstractControl): ValidationErrors | null => {
        const prefix = control.value;
        if (reservedPrefixes.includes(prefix) && prefix !== '') {
          return { existingOrReservedId: true };
        }

        if (!this.model) {
          return null;
        }

        for (const modelNamespace of this.model.getNamespaces()) {
          if (modelNamespace.prefix === prefix) {
            const isTechnical = modelNamespace.namespaceType === NamespaceType.IMPLICIT_TECHNICAL;
            const isActiveNamespace = this.activeNamespace ? this.activeNamespace.prefix === modelNamespace.prefix : false;

            if (isTechnical && this.allowTechnical) {
              return null;
            } else {
              return isActiveNamespace ? null : { existingOrReservedId: true };
            }
          }
        }

        return null;
      },
    };

    const errors = this.validateControl(control, validators);
    return errors || null;
  }

  private validateControl(control: AbstractControl, validators: { [key: string]: ValidatorFn }): ValidationErrors | null {
    const errors: ValidationErrors = {};

    for (const key in validators) {
      const validator = validators[key];
      const validationResult = validator(control);
      if (validationResult) {
        errors[key] = validationResult;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}


@Directive({
  selector: '[prefixInputAsync]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: PrefixInputAsyncDirective,
      multi: true,
    },
  ],
})
export class PrefixInputAsyncDirective implements AsyncValidator {
  @Input() isModelPrefix?: boolean;

  constructor(private validatorService: DefaultValidatorService) {}

  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!this.isModelPrefix) {
      return null;
    }

    const prefix = control.value as string;
    const prefixNotExists = await this.validatorService.prefixDoesNotExists(prefix);
    return prefixNotExists ? null : { existingId: true };
  }
}

