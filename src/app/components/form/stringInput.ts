// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';
// import { isValidIdentifier, isValidLabelLength, isValidModelLabelLength, isValidString } from './validators';

// interface StringInputAttributes extends IAttributes {
//   stringInput: string;
// }

// export const StringInputDirective: IDirectiveFactory = () => {
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link(_$scope: IScope, _element: JQuery, attributes: StringInputAttributes, ngModel: INgModelController) {
//       ngModel.$validators['string'] = isValidString;

//       if (attributes.stringInput) {
//         switch (attributes.stringInput) {
//           case 'label':
//             ngModel.$validators['length'] = isValidLabelLength;
//             break;
//           case 'modelLabel':
//             ngModel.$validators['length'] = isValidModelLabelLength;
//             break;
//           case 'identifier':
//             ngModel.$validators['id'] = isValidIdentifier;
//             break;
//           default:
//             throw new Error('Unsupported input type');
//         }
//       }
//     }
//   };
// };

import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { isValidIdentifier, isValidLabelLength, isValidModelLabelLength, isValidString } from './validators';

@Directive({
  selector: '[stringInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StringInputDirective,
      multi: true
    }
  ]
})
export class StringInputDirective implements Validator {
  @Input('stringInput') type: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    if (!isValidString(value)) {
      return { string: true };
    }

    if (this.type) {
      switch (this.type) {
        case 'label':
          if (!isValidLabelLength(value)) {
            return { length: true };
          }
          break;
        case 'modelLabel':
          if (!isValidModelLabelLength(value)) {
            return { length: true };
          }
          break;
        case 'identifier':
          if (!isValidIdentifier(value)) {
            return { id: true };
          }
          break;
        default:
          throw new Error('Unsupported input type');
      }
    }

    return null;
  }
}
