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


import { Component, Input, ViewChild } from '@angular/core';
import { availableLanguages, Language } from 'app/types/language';
import { EditableForm } from '../form/editableEntityController';
import { ControlContainer, NgForm } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject, from, merge, of } from 'rxjs';
import { DataType } from 'app/entities/dataTypes';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'editable-multiple-language-select',
  template: `
      <!-- <editable-multiple [id]="id" [title]="title" [values]="languages" [required]="required" [input]="input" >
          <ng-container slot="input">
            <autocomplete [datasource]="dataSource">
              <input [id]="id"
                    name="language"
                    type="text"
                    languageInput
                    [(ngModel)]="input"
                    autocomplete="off"
                    />
            </autocomplete>
        </ng-container>
      </editable-multiple> -->
      <editable-multiple [id]="id" [title]="title" [values]="values" [required]="required">
        <ng-container input>
          <input [id]="id"
                name="language"
                type="text"
                languageInput
                [(ngModel)]="input"
                autocomplete="off"
                [ngbTypeahead]="search"
                (focus)="focus$.next($any($event).target.value)"
                (click)="click$.next($any($event).target.value)"
                (selectItem)="onSelect($event)"
                #instance="ngbTypeahead"
                />
        </ng-container>
      </editable-multiple>
  `,
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class EditableMultipleLanguageSelectComponent {

  @Input() values: Language[];
  @Input() id: string;
  @Input() title: string;
  @Input() required: boolean;

  input: string;

  dataSource = (_search: string) => Promise.resolve(availableLanguages);

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();

  search: OperatorFunction<string, readonly Language[]>  = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			switchMap((searchText: string) => {
        return from(this.dataSource(searchText)).pipe(
          catchError(() => of([])),
          map((results: Language[]) => {
            return results
              .filter((result: Language) => this.filterResult(result, searchText))
          })
        )
      }),
		);
	};

  filterResult(result: Language, searchText: string): boolean {
    const lang = result.toLowerCase();
    return lang.includes(searchText.toLowerCase());
  }

  onSelect(item: { item: Language; }): void {
    this.values.push(item.item);
    this.clearInput();
  }

  clearInput(){
    setTimeout(()=>{ this.input = ''; }, 1);
  }
}
