// import { IAttributes, IDirectiveFactory, IModelValidators, INgModelController, IScope } from 'angular';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { isValidUri, isValidUriStem, isValidUrl } from './validators';
// import { Uri } from 'app/entities/uri';
// import { ImportedNamespace, Model } from 'app/entities/model';
// import { LanguageService } from 'app/services/languageService';
// import { anyMatching } from '@mju-psi/yti-common-ui';

// type UriInputType = 'required-namespace' | 'free-url' | 'free-uri' | 'stem';

// interface UriInputAttributes extends IAttributes {
//   uriInput: UriInputType;
// }

// export function placeholderText(uriInputType: UriInputType, gettextCatalog: GettextCatalog) {
//   switch (uriInputType) {
//     case 'free-url':
//       return gettextCatalog.getString('Write URL');
//     case 'stem':
//       return gettextCatalog.getString('Write URI');
//     case 'required-namespace':
//       return gettextCatalog.getString('Write identifier');
//     default:
//       return gettextCatalog.getString('Write identifier');
//   }
// }

// export interface WithContext {
//   context: any;
// }

// export function createParser(withContextProvider: () => WithContext) {
//   return (viewValue: string) => {
//     const withContext = withContextProvider();
//     return !viewValue ? null : new Uri(viewValue, withContext ? withContext.context : {});
//   };
// }

// export function createFormatter() {
//   return (value: Uri) => value ? value.compact : '';
// }

// interface WithImportedNamespaces {
//   importedNamespaces: ImportedNamespace[];
// }

// export function createValidators(type: UriInputType, withNamespacesProvider: () => WithImportedNamespaces) {

//   const result: IModelValidators = {};

//   if (type === 'stem') {
//     result['stem'] = isValidUriStem;
//   } else if (type === 'free-url') {
//     result['xsd:anyURI'] = isValidUri;
//     result['url'] = (value: Uri) => !value || !isValidUri(value) || isValidUrl(value);
//   } else if (type === 'free-uri') {
//     result['xsd:anyURI'] = isValidUri;
//   } else {
//     result['xsd:anyURI'] = isValidUri;
//     result['unknownNS'] = (value: Uri) => !value || !isValidUri(value) || value.resolves();
//     result['idNameRequired'] = (value: Uri) => !value || !isValidUri(value) || !value.resolves() || value.name.length > 0;

//     if (type === 'required-namespace') {
//       const isRequiredNamespace = (ns: string) => anyMatching(withNamespacesProvider().importedNamespaces, importedNamespace => importedNamespace.namespace === ns);
//       result['mustBeRequiredNS'] = (value: Uri) =>  !value || !isValidUri(value) || !value.resolves() || isRequiredNamespace(value.namespace);
//     }
//   }

//   return result;
// }

// interface UriInputScope extends IScope {
//   model: Model;
// }

// export const UriInputDirective: IDirectiveFactory = (languageService: LanguageService,
//                                                      gettextCatalog: GettextCatalog) => {
//   'ngInject';
//   return {
//     scope: {
//       model: '='
//     },
//     restrict: 'A',
//     require: 'ngModel',
//     link($scope: UriInputScope, element: JQuery, attributes: UriInputAttributes, modelController: INgModelController) {

//       if (!attributes['placeholder']) {
//         $scope.$watch(() => languageService.UILanguage, () => {
//           element.attr('placeholder', placeholderText(attributes.uriInput, gettextCatalog));
//         });
//       }

//       modelController.$parsers = [createParser(() => $scope.model)];
//       modelController.$formatters = [createFormatter()];

//       const validators = createValidators(attributes.uriInput, () => $scope.model);

//       for (const validatorName of Object.keys(validators)) {
//         modelController.$validators[validatorName] = validators[validatorName];
//       }
//     }
//   };
// };

import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2, Self} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidatorFn } from '@angular/forms';
import { isValidUri, isValidUriStem, isValidUrl } from './validators';
import { Uri } from 'app/entities/uri';
import { ImportedNamespace } from 'app/entities/model';
import { LanguageService } from 'app/services/languageService';
import { anyMatching } from '@mju-psi/yti-common-ui';
import { TranslateService } from '@ngx-translate/core';

type UriInputType = 'required-namespace' | 'free-url' | 'free-uri' | 'stem';

export function placeholderText(uriInputType: UriInputType, translateService: TranslateService) {
  switch (uriInputType) {
    case 'free-url':
      return translateService.instant('Write URL');
    case 'stem':
      return translateService.instant('Write URI');
    case 'required-namespace':
      return translateService.instant('Write identifier');
    default:
      return translateService.instant('Write identifier');
  }
}

interface WithImportedNamespaces {
  importedNamespaces: ImportedNamespace[];
  context: any;
}

export function createValidators(type: UriInputType, withNamespacesProvider: () => WithImportedNamespaces): ValidatorFn[] {
  const validators: ValidatorFn[] = [];

  if (type === 'stem') {
    validators.push((control: AbstractControl) => {
      const value: Uri = control.value;
      const isValid: boolean = isValidUriStem(value);
      let errors: { [key: string]: any } = {};

      if (!isValid) {
        return {
          stem: {
            valid: false,
            message: 'Invalid URI stem.'
          }
        };
      }

      return null;
    });
  } else if (type === 'free-url') {
    validators.push((control: AbstractControl) => {
      const value: Uri = control.value;
      const validUri: boolean = isValidUri(value);
      let errors: { [key: string]: any } = {};

      const validUrl = (value: Uri) => !value || !isValidUri(value) || isValidUrl(value);

      if (!validUri) {
        errors['xsd:anyURI'] = { value: true };
        errors['url'] = { value: true };
        return errors;
      }
      return null;
    });
  } else if (type === 'free-uri') {
    validators.push((control: AbstractControl) => {
      const value: Uri | string = control.value;
      const validUri: boolean = isValidUri(value);
      let errors: { [key: string]: any } = {};

      if (!validUri) {
        errors['xsd:anyURI'] = { value: true };
        return errors;
      }
      return null;
    });
  } else {
    validators.push((control: AbstractControl) => {
      if(!control.value){
        return null;
      }
      const value: Uri = new Uri(control.value.value, withNamespacesProvider ? withNamespacesProvider().context : {});
      const validUri: boolean = isValidUri(value);
      let errors: { [key: string]: any } = {};

      const unknownNS = (value: Uri) => !(!value || !isValidUri(value) || value.resolves());
      const idNameRequired = (value: Uri) => !(!value || !isValidUri(value) || !value.resolves() || value.name.length > 0);

      let mustBeRequiredNS;
      if (type === 'required-namespace') {
        const isRequiredNamespace = (ns: string) => anyMatching(withNamespacesProvider().importedNamespaces, importedNamespace => importedNamespace.namespace === ns);
        mustBeRequiredNS = (value: Uri) =>  !(!value || !isValidUri(value) || !value.resolves() || isRequiredNamespace(value.namespace));
      }

      if (!validUri) {
        errors['xsd:anyURI'] = { value: true };
      }
      if (unknownNS(value)) {
        errors['unknownNS'] = { value: true };
      }
      if (idNameRequired(value)) {
        errors['idNameRequired'] = { value: true };
      }
      if (mustBeRequiredNS && mustBeRequiredNS(value)) {
        errors['mustBeRequiredNS'] = { value: true };
      }

      if (Object.keys(errors).length === 0) {
        return null;
      } else {
        return errors;
      }
    });
  }

  return validators;
}

@Directive({
  selector: '[uriInput][ngModel]',
  host: {
		"(blur)": "onTouched()",
		"(change)": "handleChange( $event.target.value )"
	}
})
export class UriInputDirective implements ControlValueAccessor, OnInit {
  @Input() uriInput: UriInputType;
  @Input() model: any;

  innerValue: string | null;


  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Self() private controlDirective: NgControl
  ) {
    controlDirective.valueAccessor = this;
  }

  // @HostListener('input', ['$event.target.value'])
  public handleChange( value: string ) : void {
    const uri = !value ? null : new Uri(value, this.model ? this.model.context : {})
    this.onChange(uri);
	}

  ngOnInit(): void {

    const placeholder = placeholderText(this.uriInput, this.translateService);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'placeholder', placeholder);

    this.languageService.language$.subscribe(() => {
      const placeholder = placeholderText(this.uriInput, this.translateService);
      this.renderer.setAttribute(this.elementRef.nativeElement, 'placeholder', placeholder);
    })

    const validators = this.controlDirective.control?.validator
    ? [this.controlDirective.control.validator, ...createValidators(this.uriInput, () => this.model)]
    : createValidators(this.uriInput, () => this.model);

    this.controlDirective.control?.setValidators(validators);
    this.controlDirective.control?.updateValueAndValidity();
  }


  writeValue(value: any): void {
    const element = this.elementRef.nativeElement;
    if (value instanceof Uri) {
      this.renderer.setProperty(element, 'value', value.compact);
    } else {
      this.renderer.setProperty(element, 'value', '');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

}
