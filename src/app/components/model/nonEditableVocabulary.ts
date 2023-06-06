// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     vocabulary: '=',
//     context: '=',
//     link: '='
//   },
//   template: `
//       <div class="editable-wrap form-group">
//         <editable-label data-title="'Vocabulary'"></editable-label>
//         <span ng-if="!$ctrl.link">{{$ctrl.vocabulary.title | translateValue: $ctrl.context}}</span>
//         <a ng-if="$ctrl.link" ng-href="{{$ctrl.link}}">
//           {{$ctrl.vocabulary.title | translateValue: $ctrl.context}}
//           <i ng-if="$ctrl.link" class="fas fa-external-link-alt x-small-item"></i>
//         </a>
//       </div>
//     `
// })
// export class NonEditableVocabularyComponent {
// }

import { Component, Input  } from '@angular/core';
import { Model } from 'app/entities/model';


@Component({
  selector: 'non-editable-vocabulary',
  template: `
      <div class="editable-wrap form-group">
        <editable-label title="Vocabulary"></editable-label>
        <span *ngIf="!link">{{vocabulary.title | translateValue: context}}</span>
        <a *ngIf="link" [attr.href]="link">
          {{vocabulary.title | translateValue: context}}
          <i *ngIf="link" class="fas fa-external-link-alt x-small-item"></i>
        </a>
      </div>
    `
})
export class NonEditableVocabularyComponent  {
    @Input() vocabulary: any;
    @Input() context: Model;
    @Input() link: string;
}
