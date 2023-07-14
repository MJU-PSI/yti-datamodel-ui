// import { ReferenceDataService } from 'app/services/referenceDataService';
// import { LanguageService, Localizer } from 'app/services/languageService';
// import { ReferenceData, ReferenceDataCode } from 'app/entities/referenceData';
// import { LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     referenceData: '=',
//     context: '='
//   },
//   transclude: true,
//   template: `
//       <autocomplete datasource="$ctrl.datasource" matcher="$ctrl.matcher" value-extractor="$ctrl.valueExtractor" formatter="$ctrl.formatter">
//         <ng-transclude></ng-transclude>
//       </autocomplete>
//   `
// })
// export class CodeValueInputAutocompleteComponent {

//   referenceData: ReferenceData[];
//   context: LanguageContext;
//   localizer: Localizer;

//   constructor(private referenceDataService: ReferenceDataService, languageService: LanguageService) {
//     'ngInject';
//     this.localizer = languageService.createLocalizer(this.context);
//   }

//   datasource = () => this.referenceDataService.getReferenceDataCodes(this.referenceData);

//   formatter = (codeValue: ReferenceDataCode) => `${this.localizer.translate(codeValue.title)} (${codeValue.identifier})`;

//   valueExtractor = (codeValue: ReferenceDataCode) => codeValue.identifier;
// }


import { Component, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { ReferenceDataService } from 'app/services/referenceDataService';
import { LanguageService, Localizer } from 'app/services/languageService';
import { ReferenceData, ReferenceDataCode } from 'app/entities/referenceData';
import { LanguageContext } from 'app/types/language';
import { DataType } from 'app/entities/dataTypes';
import { ControlContainer, NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';


@Component({
  selector: 'code-value-input-autocomplete',
  template: `
    <input
      [id]="id"
      [name]="id"
      class="form-control"
      type="text"
      [datatypeInput]="inputType"
      [referenceData]="referenceData"
      [(ngModel)]="value"
      (ngModelChange)="onModelChange($event)"
      #editableInput
    />
  `,
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class CodeValueInputAutocompleteComponent implements OnInit {
  @Input() id: string;
  @Input() inputType: DataType;
  @Input() referenceData: ReferenceData[];
  @Input() context: LanguageContext;
  @Input() value: string|null;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  localizer: Localizer;

  @ViewChild('editableInput',  { read: NgModel, static: true }) inputNgModelCtrl!: NgModel;

  constructor(
    private referenceDataService: ReferenceDataService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.localizer = this.languageService.createLocalizer(this.context);
  }

  datasource = () => this.referenceDataService.getReferenceDataCodes(this.referenceData);

  formatter = (codeValue: ReferenceDataCode) =>
    `${this.localizer.translate(codeValue.title)} (${codeValue.identifier})`;

  valueExtractor = (codeValue: ReferenceDataCode) => codeValue.identifier;

  onModelChange(event: string) {
    this.valueChange.emit(event);
  }
}
