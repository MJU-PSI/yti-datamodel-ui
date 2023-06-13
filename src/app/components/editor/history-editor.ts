// import { HistoryModal } from './historyModal';
// import { Model } from 'app/entities/model';
// import { Class } from 'app/entities/class';
// import { Predicate } from 'app/entities/predicate';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     model: '=',
//     resource: '=',
//     buttonId: '<'
//   },
//   template: `
//       <button type="button" class="btn btn-secondary-action pull-right" ng-click="$ctrl.openHistory()" ng-attr-id="{{$ctrl.buttonId}}">
//         <span translate>Show history</span>
//       </button>
//   `
// })
// export class HistoryComponent {

//   model: Model;
//   resource: Class|Predicate|Model;
//   buttonId?: string;

//   constructor(private historyModal: HistoryModal) {
//     'ngInject';
//   }

//   openHistory() {
//     this.historyModal.open(this.model, this.resource);
//   }
// }

import { Component, Input } from '@angular/core';
import { Model } from 'app/entities/model';
import { Class } from 'app/entities/class';
import { Predicate } from 'app/entities/predicate';
import { HistoryEditorModal } from './history-editor-modal';

@Component({
  selector: 'history-editor',
  template: `
      <button type="button" class="btn btn-secondary-action pull-right" (click)="openHistory()" [attr.id]="buttonId">
        <span translate>Show history</span>
      </button>
  `
})
export class HistoryEditorComponent {

  @Input() model: Model;
  @Input() resource: Class | Predicate | Model;
  @Input() buttonId?: string;

  constructor(private historyModal: HistoryEditorModal) {}

  openHistory() {
    this.historyModal.open(this.model, this.resource);
  }
}
