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

import { Directive } from '@angular/core';

@Directive({
  selector: 'restrict-duplicates,[restrict-duplicates]',
})
export class RestrictDuplicatesDirective {

}
