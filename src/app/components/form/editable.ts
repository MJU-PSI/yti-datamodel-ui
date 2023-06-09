// import { INgModelController, IParseService, IScope } from 'angular';
// import { DisplayItem, DisplayItemFactory, Value } from './displayItemFactory';
// import { EditableForm } from './editableEntityController';
// import { LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';
// import { isExternalLink } from 'app/components/form/href';

// const NG_HIDE_CLASS = 'ng-hide';
// const NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

// @LegacyComponent({
//   bindings: {
//     title: '@',
//     link: '=',
//     valueAsLocalizationKey: '@',
//     disable: '=',
//     context: '=',
//     onClick: '@',
//     clipboard: '=',
//     autofocus: '@'
//   },
//   template: require('./editable.html'),
//   transclude: true,
//   require: {
//     form: '?^form'
//   }
// })
// export class EditableComponent {

//   title: string;
//   valueAsLocalizationKey: boolean;
//   link: string;
//   disable: boolean;
//   context: LanguageContext;
//   onClick: string;
//   clipboard: string;
//   autofocus: string;

//   item: DisplayItem;

//   form: EditableForm;
//   input: JQuery;
//   inputNgModelCtrl: INgModelController;

//   constructor(private $scope: IScope,
//               private $parse: IParseService,
//               private $animate: any,
//               private $element: JQuery,
//               private displayItemFactory: DisplayItemFactory) {
//     'ngInject';
//   }

//   get value() {
//     return this.inputNgModelCtrl && this.inputNgModelCtrl.$modelValue;
//   }

//   get inputId() {
//     return this.input && this.input.attr('id');
//   }

//   get required() {
//     return !this.disable && this.input && (this.input.attr('required') || (this.inputNgModelCtrl && 'requiredLocalized' in this.inputNgModelCtrl.$validators));
//   }

//   $onInit() {

//     // we need to know if handler was set or not so parse ourselves instead of using scope '&'
//     const clickHandler = this.$parse(this.onClick);
//     const onClick = this.onClick ? (value: Value) => clickHandler(this.$scope.$parent, { value }) : undefined;

//     this.item = this.displayItemFactory.create({
//       context: () => this.context,
//       value: () => this.value,
//       link: () => this.link,
//       valueAsLocalizationKey: this.valueAsLocalizationKey,
//       onClick: onClick
//     });
//   }

//   $postLink() {

//     this.input = this.$element.find('[ng-model]');
//     this.inputNgModelCtrl = this.input.controller('ngModel');

//     this.$scope.$watch(() => this.item.displayValue || this.isEditing(), show => {
//       this.$animate[show ? 'removeClass' : 'addClass'](this.$element, NG_HIDE_CLASS, {
//         tempClasses: NG_HIDE_IN_PROGRESS_CLASS
//       });
//     });

//     // move error messages element next to input
//     this.input.after(this.$element.find('error-messages').detach());

//     this.$scope.$watch(() => this.isEditing(), (currentEditing) => {

//       const shouldFocus = this.autofocus && this.$scope.$parent.$eval(this.autofocus);

//       if (shouldFocus && currentEditing) {
//         setTimeout(() => this.input.focus(), 0);
//       }
//     });

//     // TODO: prevent hidden and non-editable fields participating validation with some more obvious mechanism
//     this.$scope.$watchCollection(() => Object.keys(this.inputNgModelCtrl.$error), keys => {
//       if (!this.isEditing()) {
//         for (const key of keys) {
//           this.inputNgModelCtrl.$setValidity(key, true);
//         }
//       }
//     });
//   }

//   isEditing() {
//     return this.form && (this.form.editing || this.form.pendingEdit) && !this.disable;
//   }

//   isExternalLink(link: string): boolean {
//     return isExternalLink(link);
//   }
// }

import { Component, ContentChild, ElementRef, Inject, Injector, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { DisplayItem, DisplayItemFactory, Value } from './displayItemFactory';
import { EditableForm } from './editableEntityController';
import { LanguageContext } from 'app/types/language';
import { isExternalLink } from 'app/components/form/href';


const NG_HIDE_CLASS = 'ng-hide';
const NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

@Component({
  selector: 'editable',
  templateUrl: './editable.html'
})
export class EditableComponent implements OnInit {

  @Input() title: string;
  @Input() valueAsLocalizationKey: boolean;
  @Input() link: string;
  @Input() disable: boolean;
  @Input() context: LanguageContext;
  @Input() onClick: string;
  @Input() clipboard: string;
  @Input() autofocus: string;

  item: DisplayItem;
  itemDisplayValueBefore: string;

  @Input() form: NgForm;

  // input: ElementRef;
  // inputNgModelCtrl: NgModel;

  @ContentChild(NgModel) inputNgModelCtrl!: NgModel;
  // @ViewChild('editableInput', {static: false}) input: ElementRef;
  @ContentChild('editableInput', { read: ElementRef }) input!: ElementRef<HTMLInputElement>;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private displayItemFactory: DisplayItemFactory,
              private injector: Injector,
              ) {
  }

  // TODO ALES - PREVERI CELOTNO KOMPONENTO
  ngOnInit() {

    // we need to know if handler was set or not so parse ourselves instead of using scope '&'
    // const clickHandler = this.injector.get(this.onClick);
    // const onClick = this.onClick ? (value: Value) => clickHandler(this.context, { value }) : undefined;
    const onClick = undefined;

    this.item = this.displayItemFactory.create({
      context: () => this.context,
      value: () => this.value,
      link: () => this.link,
      valueAsLocalizationKey: this.valueAsLocalizationKey,
      onClick: onClick
    });
  }

  ngDoCheck() {
    if(this.item && this.item.displayValue !== this.itemDisplayValueBefore) {
      this.itemDisplayValueBefore = this.item.displayValue;
      const show = this.item && this.item.displayValue || this.isEditing();

      if (show) {
        this.renderer.removeClass(this.elementRef.nativeElement, NG_HIDE_CLASS);
        this.renderer.removeStyle(this.elementRef.nativeElement, NG_HIDE_IN_PROGRESS_CLASS);
      } else {
        this.renderer.addClass(this.elementRef.nativeElement, NG_HIDE_CLASS);
        this.renderer.setStyle(this.elementRef.nativeElement, NG_HIDE_IN_PROGRESS_CLASS, 'display: none;');
      }
    }
  }

  ngAfterViewInit() {

    // move error messages element next to input
    const inputElement = this.input.nativeElement;
    const errorMessageElement = this.elementRef.nativeElement.querySelector('error-messages');
    inputElement && inputElement.parentNode && inputElement.parentNode.insertBefore(errorMessageElement, inputElement.nextSibling);

    // this.isEditing() && this.autofocus && this.input && this.input.nativeElement.focus();

    // TODO: prevent hidden and non-editable fields participating validation with some more obvious mechanism
    this.inputNgModelCtrl && this.inputNgModelCtrl.statusChanges && this.inputNgModelCtrl.statusChanges.subscribe((status) => {
      if (!this.isEditing()) {
        const errors = this.inputNgModelCtrl.errors;
        if (errors) {
          Object.keys(errors).forEach(key => {
            this.inputNgModelCtrl.control?.setErrors({ [key]: null });
          });
        }
      }
    });
  }

  get value() {
    return this.inputNgModelCtrl && this.inputNgModelCtrl?.value;
  }

  get inputId() {
    return this.input && this.input.nativeElement.getAttribute('id');
  }

  get required() {
    return !this.disable && this.input && (this.input.nativeElement.required || (this.inputNgModelCtrl && this.inputNgModelCtrl?.validator && 'requiredLocalized' in this.inputNgModelCtrl?.validator!));
  }

  isEditing() {
    return this.form && (this.form.form.editing || this.form.form.pendingEdit) && !this.disable;
  }

  isExternalLink(link: string): boolean {
    return isExternalLink(link);
  }
}
