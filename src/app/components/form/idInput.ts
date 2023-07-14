// import { IAttributes, IDirectiveFactory, INgModelController, IQService, IScope } from 'angular';
// import { ValidatorService } from 'app/services/validatorService';
// import { isValidClassIdentifier, isValidIdentifier, isValidLabelLength, isValidPredicateIdentifier } from './validators';
// import { Uri } from 'app/entities/uri';
// import { Class } from 'app/entities/class';
// import { Predicate } from 'app/entities/predicate';
// import { extendNgModelOptions } from 'app/utils/angular';

// interface IdInputAttributes extends IAttributes {
//   idInput: 'class' | 'predicate';
// }

// interface IdInputScope extends IScope {
//   old: Class|Predicate;
// }

// export const IdInputDirective: IDirectiveFactory = ($q: IQService,
//                                                     validatorService: ValidatorService) => {
//   'ngInject';
//   return {
//     scope: {
//       old: '='
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: IdInputScope, _element: JQuery, attributes: IdInputAttributes, modelController: INgModelController) {
//       let previous: Uri|null = null;

//       extendNgModelOptions(modelController, {
//         updateOnDefault: true,
//         updateOn: 'blur default',
//         debounce: {
//           'blur': 0,
//           'default': 1000
//         }
//       });

//       modelController.$parsers.push((value: string) => {
//         // doesn't handle scenario without initial Uri
//         return previous ? previous.withName(value) : null;
//       });

//       modelController.$formatters.push((value: Uri) => {
//         if (value) {
//           previous = value;
//           return value.name;
//         } else {
//           return undefined;
//         }
//       });

//       modelController.$asyncValidators['existingId'] = (modelValue: Uri) => {
//         if ($scope.old.unsaved || $scope.old.id.notEquals(modelValue)) {
//           if (attributes.idInput === 'class') {
//             return validatorService.classDoesNotExist(modelValue);
//           } else if (attributes.idInput === 'predicate') {
//             return validatorService.predicateDoesNotExist(modelValue);
//           } else {
//             throw new Error('Unknown type: ' + attributes.idInput);
//           }
//         } else {
//           return $q.when(true);
//         }
//       };

//       modelController.$validators['id'] = value => {
//         if (value) {
//           try {
//             const name = value.name;
//             if (attributes.idInput === 'class') {
//               return isValidClassIdentifier(name, attributes.idInput);
//             } else if (attributes.idInput === 'predicate') {
//               return isValidPredicateIdentifier(name, attributes.idInput);
//             } else {
//               return isValidIdentifier(name, attributes.idInput);
//             }
//           } catch (e) {
//             // probably value.name getter failed
//           }
//         }
//         return false;
//       };

//       modelController.$validators['length'] = value => {
//         try {
//           return value && isValidLabelLength(value.name);
//         } catch (e) {
//           // probably value.name getter failed
//         }
//         return true; // NOTE: length error is probably not the one needed here
//       };
//     }
//   };
// };

import { Directive, ElementRef, HostListener, Input, Self } from '@angular/core';
import { AbstractControl, ValidationErrors, ControlValueAccessor, NgControl, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { isValidClassIdentifier, isValidIdentifier, isValidLabelLength, isValidPredicateIdentifier } from './validators';
import { Uri } from 'app/entities/uri';
import { DefaultValidatorService } from 'app/services/validatorService';
import { Observable } from 'rxjs';

export function validateIdInput(idInput: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value: Uri = control.value;
    if (value) {
      try {
        const name = value.name;
        if (idInput === 'class') {
          return isValidClassIdentifier(name, idInput) ? null : { id: true };
        } else if (idInput === 'predicate') {
          return isValidPredicateIdentifier(name, idInput) ? null : { id: true };
        } else {
          return isValidIdentifier(name, idInput) ? null : { id: true };
        }
      } catch (e) {
        // probably value.name getter failed
      }
    }
    return null;
  };
}

export function length(isValidLength: (value: string) => boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const values = control.value;
    if (values === null || typeof values !== 'object') {
      return null;
    }

    for (const value of Object.values(control.value)) {
      if (!isValidLength(value as string)) {
        return { length: true };
      }
    }
    return null;
  };
}

export function validateExistingId(old: any, idInput: string, validatorService: DefaultValidatorService): AsyncValidatorFn {
  return async (control: AbstractControl): Promise<Promise<ValidationErrors | null> | Observable<ValidationErrors | null>> => {
    const value: Uri = control.value;
    if (old.unsaved || old.id.notEquals(value)) {
      let notExist = false;
      if (idInput === 'class') {
        notExist = await validatorService.classDoesNotExist(value);
      } else if (idInput === 'predicate') {
        notExist = await validatorService.predicateDoesNotExist(value);
      } else {
        throw new Error('Unknown type: ' + idInput);
      }
      if(notExist){
        return null
      } else {
        return { existing: true };
      }
    }
    return null;
  }
}

@Directive({
  selector: '[idInput]',
  providers: []
})
export class IdInputDirective implements ControlValueAccessor {
  @Input('idInput') idInput: string;
  @Input() old: any;//Class|Predicate;

  private previous: Uri|null = null;

  private onChange: any = () => {};
  private onTouched: () => void;

  constructor(
    private elementRef: ElementRef,
    private validatorService: DefaultValidatorService,
    @Self() private controlDirective: NgControl) {
    controlDirective.valueAccessor = this;
  }

  ngOnInit(): void {
    const validators = this.controlDirective.control?.validator
    ? [this.controlDirective.control.validator, validateIdInput(this.idInput), length(isValidLabelLength)]
    : [validateIdInput(this.idInput), length(isValidLabelLength)];

    this.controlDirective.control?.setValidators(validators);
    this.controlDirective.control?.updateValueAndValidity();

    const asyncValidators = this.controlDirective.control?.asyncValidator
    ? [this.controlDirective.control.asyncValidator, validateExistingId(this.old, this.idInput, this.validatorService)]
    : [validateExistingId(this.old, this.idInput, this.validatorService)];
    this.controlDirective.control?.setAsyncValidators(asyncValidators);
    this.controlDirective.control?.updateValueAndValidity();
  }

  writeValue(value: any): void {
    this.previous = value;
    if (value) {
      this.elementRef.nativeElement.value = value.name;
    } else {
      this.elementRef.nativeElement.value = null;
    }
    this.onChange(value);

  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: any): void {
    if (this.previous && value) {
      this.previous = this.previous.withName(value);
      this.onChange(this.previous);
    } else {
      this.onChange(value);
    }
  }
}

