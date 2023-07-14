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
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'selection-view',
  templateUrl: './selectionView.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class SelectionViewComponent {
  @Input() editableController: any;
  @Input() model: any;
  @Input() idPrefix: string | undefined;

  parentForm: NgForm;

  constructor(private controlContainer: ControlContainer){
    this.parentForm = this.controlContainer.control as unknown as NgForm;
  }

  id(section: string): string | undefined {
    return this.idPrefix ? this.idPrefix + section : undefined;
  }
}
