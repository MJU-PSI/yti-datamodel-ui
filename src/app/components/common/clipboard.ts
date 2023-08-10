import { ITimeoutService } from 'angular';
import { EditableForm } from 'app/components/form/editableEntityController';
import { gettextCatalog as GettextCatalog } from 'angular-gettext';
import { LegacyComponent } from 'app/utils/angular';

const clipboardImage = 'assets/clippy.svg';

@LegacyComponent({
  bindings: {
    text: '='
  },
  require: {
    form: '?^form'
  },
  template: `
    <img ng-src="{{$ctrl.clipboardImage}}" class="svg-icon"
         ng-if="$ctrl.text && !$ctrl.isEditing()"
         uib-tooltip="{{$ctrl.copyInfo}}"
         uib-popover="{{'Copied' | translate}}"
         popover-is-open="$ctrl.showCopiedMessage"
         popover-trigger="none"
         ngclipboard
         ngclipboard-success="$ctrl.onCopy()"
         data-clipboard-text="{{$ctrl.text}}" />
    `
})
export class ClipboardComponent {

  text: string;
  showCopiedMessage = false;
  clipboardImage = clipboardImage;

  form: EditableForm;

  constructor(private gettextCatalog: GettextCatalog,
              private $timeout: ITimeoutService) {
    'ngInject';
  }

  isEditing() {
    return this.form && this.form.editing;
  }

  get copyInfo() {
    return this.gettextCatalog.getString('Copy "{{text}}" to clipboard', { text: this.text });
  }

  onCopy() {
    this.showCopiedMessage = true;
    this.$timeout(() => this.showCopiedMessage = false, 2000);
  }
}
