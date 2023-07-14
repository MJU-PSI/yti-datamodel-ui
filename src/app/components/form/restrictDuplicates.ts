// import { IAttributes, IDirectiveFactory, INgModelController, IScope } from 'angular';
// import { Uri } from 'app/entities/uri';
// import { contains, containsAny, flatten, referenceEquality } from '@mju-psi/yti-common-ui';

// interface RestrictDuplicatesAttributes extends IAttributes {
//   restrictDuplicates: string;
// }

// export const RestrictDuplicatesDirective: IDirectiveFactory = () => {
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: IScope, _element: JQuery, attributes: RestrictDuplicatesAttributes, ngModel: INgModelController) {

//       ngModel.$validators['duplicate'] = value => {

//         if (!value) {
//           return true;
//         }

//         const restrictDuplicates = $scope.$eval(attributes.restrictDuplicates);

//         if (typeof restrictDuplicates === 'function') {
//           return !restrictDuplicates(value);
//         } else {
//           const valuesToCheckAgainst: any[] = restrictDuplicates;

//           if (!valuesToCheckAgainst) {
//             return true;
//           }

//           if ('localizedInput' in attributes) {
//             const inputLocalizations = Object.values(value);
//             const valuesToCheckAgainstLocalizations = flatten(valuesToCheckAgainst.map(v => Object.values(v)));
//             return !containsAny(valuesToCheckAgainstLocalizations, inputLocalizations);
//           } else {
//             const equals = value instanceof Uri ? (lhs: Uri, rhs: Uri) => lhs.equals(rhs) : referenceEquality;
//             return !contains(valuesToCheckAgainst, value, equals);
//           }

//         }
//       };
//     }
//   };
// };

import { Directive, ElementRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { Uri } from 'app/entities/uri';
import { contains, containsAny, flatten, referenceEquality } from '@mju-psi/yti-common-ui';

@Directive({
  selector: '[restrictDuplicates]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RestrictDuplicatesDirective,
      multi: true
    }
  ]
})
export class RestrictDuplicatesDirective implements Validator {
  @Input('restrictDuplicates') restrictDuplicates: any[] | Function;

  constructor(private elementRef: ElementRef) {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (typeof this.restrictDuplicates === 'function') {
      return this.restrictDuplicates(value) ? null : { duplicate: true };
    } else {
      const valuesToCheckAgainst: any[] = this.restrictDuplicates;

      if (!valuesToCheckAgainst) {
        return null;
      }

      const elementAttributes = this.elementRef.nativeElement.attributes;
      const isLocalizedInput = elementAttributes.hasOwnProperty('localizedInput');

      if (isLocalizedInput) {
        const inputLocalizations = Object.values(value);
        const valuesToCheckAgainstLocalizations = flatten(valuesToCheckAgainst.map(v => Object.values(v)));
        return containsAny(valuesToCheckAgainstLocalizations, inputLocalizations)
          ? { duplicate: true }
          : null;
      } else {
        const equals = value instanceof Uri ? (lhs: Uri, rhs: Uri) => lhs.equals(rhs) : referenceEquality;
        if(contains(valuesToCheckAgainst, value, equals)) {
          console.log("duplicate");
        }
        return contains(valuesToCheckAgainst, value, equals) ? { duplicate: true } : null;
      }
    }
  }
}
