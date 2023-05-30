// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     isOpen: '=',
//     noPull: '=?'
//   },
//   transclude: true,
//   template: `<ng-transclude></ng-transclude><span ng-class="['fas', {'pull-right': !$ctrl.noPull,'fa-angle-down': $ctrl.isOpen, 'fa-angle-right': !$ctrl.isOpen}]"></span>`,
// })
// export class AccordionChevronComponent {

//   isOpen: boolean;
//   noPull: boolean;
// }

import { Component, Input } from '@angular/core';

@Component({
  selector: 'accordion-chevron',
  template: `
    <ng-content></ng-content>
    <span [class]="{'fas': true, 'pull-right': !noPull, 'fa-angle-down': isOpen, 'fa-angle-right': !isOpen}"></span>
  `,
})
export class AccordionChevronComponent {
  @Input() isOpen!: boolean;
  @Input() noPull?: boolean;
}
