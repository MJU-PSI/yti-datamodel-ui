// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     editableController: '=',
//     model: '=',
//     idPrefix: '<'
//   },
//   transclude: {
//     'content': 'selectionContent',
//     'buttons': '?selectionButtons'
//   },
//   template: require('./selectionView.html')
// })
// export class SelectionViewComponent {
//   idPrefix?: string;

//   id(section: string): string | undefined {
//     return this.idPrefix ? this.idPrefix + section : undefined;
//   }
// }


import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'selection-view',
  templateUrl: './selectionView.html'
})
export class SelectionViewComponent {
  @Input() editableController: any;
  @Input() model: any;
  @Input() idPrefix: string | undefined;
  @Input() form: NgForm;

  id(section: string): string | undefined {
    return this.idPrefix ? this.idPrefix + section : undefined;
  }
}
