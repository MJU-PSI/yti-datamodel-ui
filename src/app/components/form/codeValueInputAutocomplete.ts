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


import { Component, Input, OnInit } from '@angular/core';
import { ReferenceDataService } from 'app/services/referenceDataService';
import { LanguageService, Localizer } from 'app/services/languageService';
import { ReferenceData, ReferenceDataCode } from 'app/entities/referenceData';
import { LanguageContext } from 'app/types/language';


@Component({
  selector: 'code-value-input-autocomplete',
  template: `
    <!-- TODO ALES - od kje to pride -->
    <!-- [matcher]="matcher" -->
    <autocomplete [datasource]="datasource"  [valueExtractor]="valueExtractor" [formatter]="formatter">
      <ng-container></ng-container>
    </autocomplete>
  `,
})
export class CodeValueInputAutocompleteComponent implements OnInit {
  @Input() referenceData: ReferenceData[];
  @Input() context: LanguageContext;

  localizer: Localizer;

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
}
