// import { IModelFormatter, INgModelController, IQService, IScope } from 'angular';
// import { EditableForm } from '../../components/form/editableEntityController';
// import { arrayAsyncValidator, arrayValidator } from '../../components/form/validators';
// import { extendNgModelOptions, formatWithFormatters, LegacyComponent, validateWithValidators, ValidationResult } from '../../utils/angular';
// import { remove, enter, normalizeAsId } from '@mju-psi/yti-common-ui';
// import { isExternalLink } from 'app/components/form/href';

// const skipValidators = new Set<string>(['duplicate']);

// interface EditableMultipleScope extends IScope {
//   ngModelControllers: INgModelController[];
// }

// @LegacyComponent({
//   bindings: {
//     ngModel: '=',
//     input: '=',
//     id: '@',
//     title: '@',
//     link: '=',
//     required: '='
//   },
//   transclude: {
//     input: 'inputContainer',
//     button: '?buttonContainer'
//   },
//   template: require('./editableMultiple.html'),
//   require: {
//     'ngModelCtrl': 'ngModel',
//     'form': '?^form'
//   }
// })
// export class EditableMultipleComponent<T> {

//   ngModel: T[];
//   input: T|null;
//   id: string;
//   title: string;
//   formatter: IModelFormatter[];
//   link: (item: T) => string;
//   required: boolean;
//   validation: ValidationResult<T>;

//   form: EditableForm;
//   ngModelCtrl: INgModelController;

//   constructor(private $scope: EditableMultipleScope,
//               private $q: IQService,
//               private $element: JQuery) {
//     'ngInject';
//   }

//   $postLink() {

//     const inputElement = this.$element.find('input');
//     const inputNgModelCtrl = inputElement.controller('ngModel');

//     const keyDownHandler = (event: JQueryEventObject) => this.$scope.$apply(() => this.keyPressed(event));
//     const blurHandler = () => this.$scope.$apply(() => this.addValueFromInput());

//     inputElement.on('keydown', keyDownHandler);
//     inputElement.on('blur', blurHandler);

//     this.$scope.$on('$destroy', () => {
//       inputElement.off('keydown', keyDownHandler);
//       inputElement.off('blur', blurHandler);
//     });

//     extendNgModelOptions(this.ngModelCtrl, { allowInvalid: true });
//     this.$scope.ngModelControllers = [inputNgModelCtrl, this.ngModelCtrl];

//     this.$scope.$watchCollection(() => inputNgModelCtrl.$formatters, formatters => this.formatter = formatters);

//     this.$scope.$watchCollection(() => Object.keys(inputNgModelCtrl.$validators),
//       (current, previous) => this.resetValidators(current, previous));

//     this.$scope.$watchCollection(() => Object.values(inputNgModelCtrl.$validators), () => {
//       this.resetValidators();
//     });

//     this.$scope.$watchCollection(() => Object.keys(inputNgModelCtrl.$asyncValidators),
//       (current, previous) => this.resetAsyncValidators(current, previous));

//     this.$scope.$watchCollection(() => Object.values(inputNgModelCtrl.$asyncValidators), () => {
//       const asyncValidatorNames = Object.keys(inputNgModelCtrl.$asyncValidators);
//       this.resetAsyncValidators(asyncValidatorNames, asyncValidatorNames);
//     });

//     if (this.required) {
//       this.ngModelCtrl.$validators['required'] = (value: any[]) => value && value.length > 0;
//     }

//     this.$scope.$watchCollection(() => this.ngModel, () => this.validate());
//   }

//   validate() {

//     const inputElement = this.$element.find('input');
//     const inputNgModelCtrl = inputElement.controller('ngModel');

//     this.ngModelCtrl.$validate();
//     validateWithValidators<any>(this.$q, inputNgModelCtrl, skipValidators, this.ngModelCtrl.$modelValue || [])
//       .then(validation => this.validation = validation);
//   };

//   resetAsyncValidators(asyncValidatorNames?: string[], oldAsyncValidatorNames?: string[]) {

//     const inputElement = this.$element.find('input');
//     const inputNgModelCtrl = inputElement.controller('ngModel');
//     const validatorNames = Object.keys(inputNgModelCtrl.$validators);

//     for (const asyncValidator of oldAsyncValidatorNames || validatorNames) {
//       if (!skipValidators.has(asyncValidator)) {
//         delete this.ngModelCtrl.$asyncValidators[asyncValidator];
//         this.ngModelCtrl.$setValidity(asyncValidator, true);
//       }
//     }

//     for (const asyncValidator of asyncValidatorNames || validatorNames) {
//       if (!skipValidators.has(asyncValidator)) {
//         this.ngModelCtrl.$asyncValidators[asyncValidator] = arrayAsyncValidator(this.$q, inputNgModelCtrl.$asyncValidators[asyncValidator]);
//       }
//     }

//     this.validate();
//   }

//   resetValidators(validators?: string[], oldValidators?: string[]) {

//     const inputElement = this.$element.find('input');
//     const inputNgModelCtrl = inputElement.controller('ngModel');
//     const validatorNames = Object.keys(inputNgModelCtrl.$validators);

//     for (const validator of oldValidators || validatorNames) {
//       if (!skipValidators.has(validator)) {
//         delete this.ngModelCtrl.$validators[validator];
//         this.ngModelCtrl.$setValidity(validator, true);
//       }
//     }

//     for (const validator of validators || validatorNames) {
//       if (!skipValidators.has(validator)) {
//         this.ngModelCtrl.$validators[validator] = arrayValidator(inputNgModelCtrl.$validators[validator]);
//       }
//     }

//     this.validate();
//   }

//   isEditing() {
//     return this.form.editing;
//   }

//   format(value: T): string {
//     return formatWithFormatters(value, this.formatter);
//   }

//   isValid(value: T) {
//     return !this.validation || this.validation.isValid(value);
//   }

//   deleteValue(value: T) {
//     remove(this.ngModel, value);
//   }

//   keyPressed(event: JQueryEventObject) {
//     if (event.keyCode === enter && this.input) {
//       this.addValueFromInput();
//       event.preventDefault();
//     }
//   }

//   addValue(value: T) {
//     this.ngModel.push(value);
//   }

//   addValueFromInput() {
//     if (this.input) {
//       this.addValue(this.input);
//       this.input = null;
//     }
//   }

//   normalizeValueForId(value: string): string {
//     return normalizeAsId(value);
//   }

//   isLink(value: T): boolean {
//     return !!this.link(value);
//   }

//   showLink(value: T): boolean {
//     return (this.link !== undefined) && this.isLink(value);
//   }

//   isExternalLink(link: string): boolean {
//     return isExternalLink(link);
//   }
// }


import { Component, ContentChild, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormControlDirective, FormGroupDirective, NgControl, NgForm, NgModel } from '@angular/forms';
import { EditableForm } from '../../components/form/editableEntityController';
import { arrayAsyncValidator, arrayValidator } from '../../components/form/validators';
import { extendNgModelOptions, formatWithFormatters, ValidationResult } from '../../utils/angular';
import { remove, enter, normalizeAsId } from '@mju-psi/yti-common-ui';
import { isExternalLink } from 'app/components/form/href';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EditableService } from 'app/services/editable.service';

const skipValidators = new Set<string>(['duplicate']);

@Component({
  selector: 'editable-multiple',
  templateUrl: './editable-multiple.html',
})
export class EditableMultipleComponent<T> {

  @Input() values: T[];
  @Input() id: string;
  @Input() title: string;
  @Input() link: (item: T) => string;
  @Input() required: boolean;
  @Input() formatter: (value: any) => string;

  inputNgModelCtrl: NgModel;
  input: ElementRef;

  @ContentChild('editableInput', { read: ElementRef }) inputElementRef!: ElementRef<HTMLInputElement>;
  @ContentChild('editableInput', { read: NgModel, static: false }) inputNgModel!: NgModel;

  constructor(
    private elementRef: ElementRef,
    private editableService: EditableService
  ) {}

  ngOnInit() {

     // move error messages element next to input
     const inputElement = this.elementRef.nativeElement.querySelector('input');
     const errorMessageElement = this.elementRef.nativeElement.querySelector('error-messages');
     inputElement && inputElement.parentNode && inputElement.parentNode.insertBefore(errorMessageElement, inputElement.nextSibling);
  }


  ngAfterContentChecked() {
    this.inputNgModelCtrl = this.inputNgModel ? this.inputNgModel : this.inputNgModelCtrl;

    this.input = this.inputElementRef ? this.inputElementRef : this.input;

    // TODO: prevent hidden and non-editable fields participating validation with some more obvious mechanism
    this.inputNgModelCtrl && this.inputNgModelCtrl.statusChanges && this.inputNgModelCtrl.statusChanges.subscribe((status) => {
      if (!this.isEditing()) {
        const errors = this.inputNgModelCtrl.errors;
        if (errors) {
          Object.keys(errors).forEach(key => {
            if(errors[key] !== null) {
              this.inputNgModelCtrl.control?.setErrors({ [key]: null });
            }
          });
        }
      }
    });

  }

  isEditing() {
    return this.editableService.editing;
  }

  format(value: T): string {
    if (this.formatter) {
    return this.formatter(value);
    } else {
      return String(value);
    }
  }

  isValid(value: T) {
    // return !this.validation || this.validation.isValid(value);
    return true;
  }

  deleteValue(value: T) {
    remove(this.values, value);
  }

  normalizeValueForId(value: string): string {
    return normalizeAsId(value);
  }

  isLink(value: T): boolean {
    return !!this.link(value);
  }

  showLink(value: T): boolean {
    return (this.link !== undefined) && this.isLink(value);
  }

  isExternalLink(link: string): boolean {
    return isExternalLink(link);
  }
}
