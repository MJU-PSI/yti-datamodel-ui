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

import { Component, Input, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { DataType } from 'app/entities/dataTypes';
import { ReferenceData, ReferenceDataCode } from 'app/entities/referenceData';
import { LanguageService, Localizer } from 'app/services/languageService';
import { ReferenceDataService } from 'app/services/referenceDataService';
import { LanguageContext } from 'app/types/language';
import { Observable, OperatorFunction, Subject, from, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'editable-multiple-data-type-input',
  template: `
      <editable-multiple [id]="id" [title]="title" [(values)]="values">
            <ng-container input>
              <input [id]="id"
                    name="data-type-input"
                    type="text"
                    ignoreForm
                    [datatypeInput]="inputType"
                    [referenceData]="referenceData"
                    [(ngModel)]="input"
                    [restrictDuplicates]="values"
                    [ngbTypeahead]="search"
                    (focus)="focus$.next($any($event).target.value)"
                    (click)="click$.next($any($event).target.value)"
                    (selectItem)="onSelect($event)"
                    (keyup.enter)="onModelChange(input)"
                    (blur)="onModelChange(input)"
                    #instance="ngbTypeahead"
                    #editableInput
                    />
            </ng-container>
      </editable-multiple>
  `,
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class EditableMultipleDataTypeInputComponent {

  @Input() values: string[];
  @Input() inputType: DataType;
  @Input() id: string;
  @Input() title: string;
  @Input() referenceData: ReferenceData;
  @Input() context: LanguageContext;

  input: string;

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();

  localizer: Localizer;

  constructor(
    private referenceDataService: ReferenceDataService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.localizer = this.languageService.createLocalizer(this.context);
  }

  datasource = (_search: string) => this.referenceDataService.getReferenceDataCodes(this.referenceData);

  search: OperatorFunction<string, readonly ReferenceDataCode[]>  = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			switchMap((searchText: string) => {
        return from(this.datasource(searchText)).pipe(
          catchError(() => of([])),
          map((dataCodes: ReferenceDataCode[]) => {

            return dataCodes
            .filter((dataCode: ReferenceDataCode) => this.filterResult(dataCode, searchText))
          })
        )
      }),
		);
	};

  filterResult(dataCode: ReferenceDataCode, searchText: string): boolean {
    const identifier = dataCode.identifier!.toLowerCase();
    return identifier.includes(searchText.toLowerCase());
  }

  resultFormatter(codeValue: ReferenceDataCode): string {
    return `${this.localizer.translate(codeValue.title)} (${codeValue.identifier})`;
  }

  inputFormatter(codeValue: ReferenceDataCode): string {
    return `${this.localizer.translate(codeValue.title)} (${codeValue.identifier})`;
  }

  onModelChange(value: any): void {
    if(value){
      this.values.push(value);
      this.clearInput();
    }
  }

  onSelect(item: { item: string; }): void {
    this.values.push(item.item);
    this.clearInput();
  }

  clearInput(){
    setTimeout(()=>{ this.input = ''; }, 1);
  }
}
