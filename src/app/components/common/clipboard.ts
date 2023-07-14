// import { ITimeoutService } from 'angular';
// import { EditableForm } from 'app/components/form/editableEntityController';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { LegacyComponent } from 'app/utils/angular';

// const clipboardImage = '../../../assets/clippy.svg';

// @LegacyComponent({
//   bindings: {
//     text: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: `
//     <img ng-src="{{$ctrl.clipboardImage}}" class="svg-icon"
//          ng-if="$ctrl.text && !$ctrl.isEditing()"
//          uib-tooltip="{{$ctrl.copyInfo}}"
//          uib-popover="{{'Copied' | translate}}"
//          popover-is-open="$ctrl.showCopiedMessage"
//          popover-trigger="none"
//          ngclipboard
//          ngclipboard-success="$ctrl.onCopy()"
//          data-clipboard-text="{{$ctrl.text}}" />
//     `
// })
// export class ClipboardComponent {

//   text: string;
//   showCopiedMessage = false;
//   clipboardImage = clipboardImage;

//   form: EditableForm;

//   constructor(private gettextCatalog: GettextCatalog,
//               private $timeout: ITimeoutService) {
//     'ngInject';
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   get copyInfo() {
//     return this.gettextCatalog.getString('Copy "{{text}}" to clipboard', { text: this.text });
//   }

//   onCopy() {
//     this.showCopiedMessage = true;
//     this.$timeout(() => this.showCopiedMessage = false, 2000);
//   }
// }


import { Component, InjectionToken, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EditableForm } from '../form/editableEntityController';
import { EditableService } from 'app/services/editable.service';

const clipboardImage = '../../../assets/clippy.svg';

export const EDITABLE_FORM_TOKEN = new InjectionToken<EditableForm>('editable form');

// TODO ALES  -      [cdkCopyToClipboard]="text"
@Component({
  selector: 'clipboard',
  template: `
    <!-- <img [src]="clipboardImage" class="svg-icon" -->
    <button
    *ngIf="text && !isEditing()"
    [attr.aria-label]="copyInfo"
    [ngbTooltip]="copyInfo"
    [cdkCopyToClipboard]="copyInfo"
    (cdkCopyToClipboardSuccess)="onCopy()"
    (cdkCopyToClipboardCopied)="showCopiedMessage = true;"
    (click)="showCopiedMessage = false" >
    <img [src]="clipboardImage" class="svg-icon" />
  </button>
  `
})
export class ClipboardComponent {

  @Input() text: string;

  showCopiedMessage = false;
  clipboardImage = clipboardImage;

  constructor(
    private translateService: TranslateService,
    private editableService: EditableService
    ) { }

  isEditing() {
    return this.editableService.editing;
  }

  get copyInfo() {
    return this.translateService.instant(`Copy ${this.text} to clipboard`);
  }

  onCopy() {
    this.showCopiedMessage = true;
    setTimeout(() => {
      this.showCopiedMessage = false;
    }, 2000);
  }
}
