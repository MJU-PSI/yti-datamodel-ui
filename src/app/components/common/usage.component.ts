// import { IScope } from 'angular';
// import { Referrer, Usage } from 'app/entities/usage';
// import { LanguageContext } from 'app/types/language';
// import { groupBy, stringMapToObject } from '@mju-psi/yti-common-ui';
// import { LegacyComponent } from 'app/utils/angular';
// import { EditableForm } from 'app/components/form/editableEntityController';

// @LegacyComponent({
//   bindings: {
//     usage: '=',
//     exclude: '=',
//     context: '=',
//     showLinks: '@'
//   },
//   require: {
//     form: '?^form'
//   },
//   template: require('./usage.html')
// })
// export class UsageComponent {

//   usage: Usage;
//   exclude: (referrer: Referrer) => boolean;
//   context: LanguageContext;
//   showLinks: string;
//   referrers: { [type: string]: Referrer[] };

//   form: EditableForm;

//   constructor(private $scope: IScope) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.usage, usage => {
//       if (usage) {
//         const excludeFilter = (referrer: Referrer) => referrer.normalizedType && !this.exclude || !this.exclude(referrer);
//         this.referrers = stringMapToObject(groupBy(usage.referrers.filter(excludeFilter), referrer => referrer.normalizedType!));
//       } else {
//         this.referrers = {};
//       }
//     });
//   }

//   isShowLinks() {
//     return this.showLinks === 'true' && (!this.form || !this.form.editing);
//   }
// }



import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { Usage, Referrer } from 'app/entities/usage';
import { LanguageContext } from 'app/types/language';
import { groupBy, stringMapToObject } from '@mju-psi/yti-common-ui';
import { EditableForm } from 'app/components/form/editableEntityController';
import { EDITABLE_FORM_TOKEN } from './clipboard';
import { KeyValue, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'usage',
  templateUrl: './usage.component.html'
})
export class UsageComponent implements OnInit {

  @Input() usage: Usage;
  @Input() exclude: (referrer: Referrer) => boolean;
  @Input() context: LanguageContext;
  @Input() showLinks: string;

  referrers: { [type: string]: Referrer[] };
  // form: EditableForm;

  constructor(@Optional() @Inject(EDITABLE_FORM_TOKEN) private form: EditableForm) { }

  ngOnInit(): void {
    this.usageChange();
  }

  ngOnChanges(): void {
    this.usageChange();
  }

  private usageChange(): void {
    if (this.usage) {
      const excludeFilter = (referrer: Referrer) => referrer.normalizedType && (!this.exclude || !this.exclude(referrer));
      this.referrers = stringMapToObject(groupBy(this.usage.referrers.filter(excludeFilter), referrer => referrer.normalizedType!));
    } else {
      this.referrers = {};
    }
  }

  isShowLinks(): boolean {
    return this.showLinks === 'true' && (!this.form || !this.form.editing);
  }
}
