// import { DataType } from 'app/entities/dataTypes';
// import { ReferenceData } from 'app/entities/referenceData';
// import { LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     ngModel: '=',
//     inputType: '=',
//     id: '@',
//     title: '@',
//     referenceData: '=',
//     context: '='
//   },
//   template: `
//       <editable-multiple id="{{$ctrl.id}}" data-title="{{$ctrl.title}}" ng-model="$ctrl.ngModel" input="$ctrl.input">
//         <input-container>
//           <code-value-input-autocomplete reference-data="$ctrl.referenceData" context="$ctrl.context">
//             <input id="{{$ctrl.id}}"
//                    type="text"
//                    restrict-duplicates="$ctrl.ngModel"
//                    datatype-input="$ctrl.inputType"
//                    ignore-form
//                    reference-data="$ctrl.referenceData"
//                    ng-model="$ctrl.input" />
//           </code-value-input-autocomplete>
//         </input-container>
//       </editable-multiple>
//   `
// })
// export class EditableMultipleDataTypeInputComponent {

//   ngModel: string[];
//   input: string;
//   inputType: DataType;
//   id: string;
//   title: string;
//   referenceData: ReferenceData;
//   context: LanguageContext;
// }

import { Component, Input } from '@angular/core';
import { DataType } from 'app/entities/dataTypes';
import { ReferenceData } from 'app/entities/referenceData';
import { LanguageContext } from 'app/types/language';

@Component({
  selector: 'editable-multiple-data-type-input',
  template: `
      <editable-multiple id="{{id}}" data-title="{{title}}" [(ngModel)]="ngModel" [input]="input">
        <input-container>
          <code-value-input-autocomplete [referenceData]="referenceData" [context]="context">
            <input id="{{id}}"
                   type="text"
                   restrictDuplicates="ngModel"
                   datatypeInput="inputType"
                   ignore-form
                   referenceData="referenceData"
                   [(ngModel)]="input" />
          </code-value-input-autocomplete>
        </input-container>
      </editable-multiple>
  `
})
export class EditableMultipleDataTypeInputComponent {

  @Input() ngModel: string[];
  @Input() input: string;
  @Input() inputType: DataType;
  @Input() id: string;
  @Input() title: string;
  @Input() referenceData: ReferenceData;
  @Input() context: LanguageContext;
}
