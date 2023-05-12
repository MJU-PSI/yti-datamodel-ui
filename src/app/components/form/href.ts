// import { IDirectiveFactory, IScope, ITimeoutService } from 'angular';

// export const HrefDirective: IDirectiveFactory = ($timeout: ITimeoutService) => {
//   'ngInject';
//   return {
//     restrict: 'A',
//     link(_$scope: IScope, element: JQuery) {
//       $timeout(() => {
//         const link = element.attr('href');
//         if (isExternalLink(link)) {
//           element.attr('target', '_blank');
//           element.attr('rel', 'noopener noreferrer');
//         }
//       });
//     }
//   };
// };

// export function isExternalLink(link: string): boolean {
//   return !!link && !link.startsWith('/') && !link.startsWith('#');
// }

import { Directive } from '@angular/core';

@Directive({
  selector: 'href,[href]',
})
export class HrefDirective {

}

export function isExternalLink(link: string): boolean {
  return !!link && !link.startsWith('/') && !link.startsWith('#');
}
