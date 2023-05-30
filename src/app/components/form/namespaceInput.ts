// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';
// import { isValidNamespaceUrlOrUrn } from './validators';
// import { ImportedNamespace, Model, NamespaceType } from '../../entities/model';

// interface NamespaceInputScope extends IScope {
//   model: Model;
//   activeNamespace: ImportedNamespace;
//   allowTechnical: boolean;
//   usedNamespaces?: string[];
// }

// export const NamespaceInputDirective: IDirectiveFactory = () => {
//   return {
//     scope: {
//       model: '=?',
//       activeNamespace: '=?',
//       allowTechnical: '=?',
//       usedNamespaces: '=?'
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: NamespaceInputScope, _element: JQuery, _attributes: IAttributes, ngModel: INgModelController) {

//       ngModel.$validators['namespaceUrlOrUrn'] = isValidNamespaceUrlOrUrn;
//       ngModel.$validators['existingId'] = (ns: string) => {

//         const model = $scope.model;
//         const activeNamespace = $scope.activeNamespace;
//         const allowTechnical = $scope.allowTechnical;
//         const usedNamespaces: string[] = $scope.usedNamespaces ? $scope.usedNamespaces : [];

//         if (usedNamespaces.includes(ns)) {
//           return false;
//         }

//         if (!model) {
//           return true;
//         } else {
//           for (const modelNamespace of model.getNamespaces()) {
//             if (modelNamespace.url === ns) {

//               const isTechnical = modelNamespace.namespaceType === NamespaceType.IMPLICIT_TECHNICAL;
//               const isActiveNamespace = activeNamespace ? activeNamespace.namespace === modelNamespace.url : false;

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
//     }
//   };
// };

import { Directive, Input, OnInit, Optional } from '@angular/core';
import { NgModel, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidNamespaceUrlOrUrn, isValidPrefix } from './validators';
import { ImportedNamespace, Model, NamespaceType } from '../../entities/model';

interface NamespaceInputScope {
  model?: Model;
  activeNamespace?: ImportedNamespace;
  allowTechnical?: boolean;
  usedNamespaces?: string[];
}

@Directive({
  selector: '[namespaceInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NamespaceInputDirective,
      multi: true
    }
  ]
})
export class NamespaceInputDirective implements Validator {

    @Input() model?: Model;
    @Input() activeNamespace?: ImportedNamespace;
    @Input() allowTechnical?: boolean;
    @Input() usedNamespaces?: string[];


  constructor() {}

  validate(control: AbstractControl):  ValidationErrors | null {

    const validators: { [key: string]: ValidatorFn } = {
      namespaceUrlOrUrn: isValidNamespaceUrlOrUrn,
      existingId: (control: AbstractControl): ValidationErrors | null => {
        const ns = control.value;

        if (this.usedNamespaces?.includes(ns)) {
          return { existingId: true };
        }

        if (!this.model) {
          return null;
        }

        for (const modelNamespace of this.model.getNamespaces()) {
          if (modelNamespace.url === ns) {
            const isTechnical = modelNamespace.namespaceType === NamespaceType.IMPLICIT_TECHNICAL;
            const isActiveNamespace = this.activeNamespace ? this.activeNamespace.namespace === modelNamespace.url : false;

            if (isTechnical && this.allowTechnical) {
              return null;
            } else {
              return isActiveNamespace ? null : { existingId: true };
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
