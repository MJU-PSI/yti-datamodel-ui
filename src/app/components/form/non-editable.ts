// import { IParseService, IScope } from 'angular';
// import { DisplayItem, DisplayItemFactory, Value } from './displayItemFactory';
// import { EditableForm } from './editableEntityController';
// import { LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';
// import { isExternalLink } from 'app/components/form/href';

// @LegacyComponent({
//   bindings: {
//     title: '@',
//     value: '=',
//     link: '=',
//     onClick: '@',
//     valueAsLocalizationKey: '@',
//     context: '=',
//     clipboard: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: require('./nonEditable.html')
// })
// export class NonEditableComponent {

//   title: string;
//   value: Value;
//   link: string;
//   valueAsLocalizationKey: boolean;
//   context: LanguageContext;
//   onClick: string;
//   clipboard: string;

//   item: DisplayItem;

//   form: EditableForm;

//   constructor(private $scope: IScope,
//               private $parse: IParseService,
//               private displayItemFactory: DisplayItemFactory) {
//     'ngInject';
//   }

//   $onInit() {

//     // we need to know if handler was set or not so parse ourselves instead of using scope '&'
//     const clickHandler = this.$parse(this.onClick);
//     const onClick = this.onClick ? (value: Value) => clickHandler(this.$scope.$parent, {value}) : undefined;

//     this.item = this.displayItemFactory.create({
//       context: () => this.context,
//       value: () => this.value,
//       link: () => this.link,
//       valueAsLocalizationKey: this.valueAsLocalizationKey,
//       hideLinks: () => this.isEditing(),
//       onClick: onClick
//     });
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   get style(): {} {
//     if (this.isEditing()) {
//       return { 'margin-bottom': '33px'};
//     } else {
//       return {};
//     }
//   }

//   isExternalLink(link: string): boolean {
//     return isExternalLink(link);
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { DisplayItem, DisplayItemFactory, Value } from './displayItemFactory';
import { LanguageContext } from 'app/types/language';
import { isExternalLink } from 'app/components/form/href';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'non-editable',
  templateUrl: './non-editable.html'
})
export class NonEditableComponent implements OnInit {

  @Input() title: string;
  @Input() value: Value;
  @Input() link: string;
  @Input() onClick: string;
  @Input() valueAsLocalizationKey: boolean;
  @Input() context: LanguageContext;
  @Input() clipboard: string;
  @Input() form: NgForm;

  item: DisplayItem;

  constructor(private displayItemFactory: DisplayItemFactory) { }

  ngOnInit() {

    const clickHandler = this.onClick ? new Function('$event', this.onClick) : undefined;
    const onClick = this.onClick ? (value: Value) => clickHandler && clickHandler({value}) : undefined;


    this.item = this.displayItemFactory.create({
      context: () => this.context,
      value: () => this.value,
      link: () => this.link,
      valueAsLocalizationKey: this.valueAsLocalizationKey,
      hideLinks: () => this.isEditing(),
      onClick: onClick
    });
  }

  isEditing() {
    return this.form && this.form.form.editing;
  }

  get style(): {} {
    if (this.isEditing()) {
      return { 'margin-bottom': '33px'};
    } else {
      return {};
    }
  }

  isExternalLink(link: string): boolean {
    return isExternalLink(link);
  }
}
