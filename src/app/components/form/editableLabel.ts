// import { IScope } from 'angular';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { EditableForm } from './editableEntityController';
// import { LanguageService } from 'app/services/languageService';
// import { isLocalizationDefined } from 'app/utils/language';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     title: '=',
//     inputId: '=',
//     required: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: `
//       <label ng-attr-for="{{$ctrl.forId}}">{{$ctrl.title | translate}}
//          <span ng-show="$ctrl.infoText" class="fas fa-info-circle info" uib-tooltip="{{$ctrl.infoText}}"></span>
//          <span ng-show="$ctrl.required && $ctrl.isEditing()" class="fas fa-asterisk" uib-tooltip="{{'Required' | translate}}"></span>
//       </label>
//   `
// })
// export class EditableLabelComponent {

//   title: string;
//   inputId: string;
//   infoText: string;

//   form: EditableForm;

//   constructor(private $scope: IScope,
//               private $element: JQuery,
//               private gettextCatalog: GettextCatalog,
//               private languageService: LanguageService) {
//     'ngInject';
//   }

//   $onInit() {
//     const key = this.title + ' info';

//     this.$scope.$watch(() => this.languageService.UILanguage, () => {
//       const infoText = this.gettextCatalog.getString(key);
//       this.infoText = isLocalizationDefined(key, infoText) ? infoText : '';
//     });
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   get forId(): string | undefined {
//     if (this.isEditing() && this.inputId) {
//       return this.inputId;
//     }
//     return undefined;
//   }
// }

import { Component, Inject, Input, OnInit } from '@angular/core';
import { EditableForm } from './editableEntityController';
import { LanguageService } from 'app/services/languageService';
import { isLocalizationDefined } from 'app/utils/language';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'editable-label',
  template: `
      <label [for]="forId">{{title | translate}}
         <span *ngIf="infoText" class="fas fa-info-circle info" [ngbTooltip] ="infoText"></span>
         <span *ngIf="required && isEditing()" class="fas fa-asterisk" [ngbTooltip]="'Required' | translate"></span>
      </label>
  `
})
export class EditableLabelComponent implements OnInit {
  @Input() title: string;
  @Input() inputId: string;
  @Input() required: boolean;

  infoText: string;

  constructor(private languageService: LanguageService, private translateService: TranslateService,
    @Inject(NgForm) private form: NgForm) {}

  ngOnInit() {
    const key = this.title + ' info';

    this.languageService.language$.subscribe(() => {
      const infoText = this.translateService.instant(key);
      this.infoText = isLocalizationDefined(key, infoText) ? infoText : '';
    });
  }

  isEditing() {
    return this.form && this.form.form.editing;
  }

  get forId(): string | undefined {
    if (this.isEditing() && this.inputId) {
      return this.inputId;
    }
    return undefined;
  }
}
