// import { IQService } from 'angular';
// import { availableLanguages, Language } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     ngModel: '=',
//     id: '@',
//     title: '@',
//     required: '='
//   },
//   template: `
//       <editable-multiple id="{{$ctrl.id}}" data-title="{{$ctrl.title}}" ng-model="$ctrl.ngModel" required="$ctrl.required" input="$ctrl.input">
//         <input-container>
//           <autocomplete datasource="$ctrl.datasource">
//             <input id="{{$ctrl.id}}"
//                    type="text"
//                    restrict-duplicates="$ctrl.ngModel"
//                    language-input
//                    ignore-form
//                    autocomplete="off"
//                    ng-model="$ctrl.input" />
//           </autocomplete>
//         </input-container>
//       </editable-multiple>
//   `
// })
// export class EditableMultipleLanguageSelectComponent {

//   ngModel: Language[];
//   input: Language;
//   id: string;
//   title: string;

//   constructor(private $q: IQService) {
//     'ngInject';
//   }

//   datasource = (_search: string) => this.$q.when(availableLanguages);
// }


import { Component, Input } from '@angular/core';
import { availableLanguages, Language } from 'app/types/language';
import { EditableForm } from '../form/editableEntityController';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'editable-multiple-language-select',
  template: `
      <editable-multiple [id]="id" [title]="title" [values]="languages" [required]="required" [input]="input" [form]="form">
        <!-- <input-container> -->
          <ng-container slot="input">
            <autocomplete [dataSource]="dataSource">
              <input [id]="id"
                    type="text"
                    languageInput
                    [(ngModel)]="input"
                    autocomplete="off"
                    />
            </autocomplete>
          <!-- </input-container> -->
        </ng-container>
      </editable-multiple>
  `
})
export class EditableMultipleLanguageSelectComponent {

  @Input() languages: Language[];
  @Input() input: Language;
  @Input() id: string;
  @Input() title: string;
  @Input() required: boolean;
  @Input() form: NgForm;

  dataSource = (_search: string) => Promise.resolve(availableLanguages);
}
