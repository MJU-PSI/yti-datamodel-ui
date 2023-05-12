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

import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, NgModel } from '@angular/forms';
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

export interface WithContext {
  context: any;
}

export function createParser(withContextProvider: () => WithContext) {
  return (viewValue: string) => {
    const withContext = withContextProvider();
    return !viewValue ? null : new Uri(viewValue, withContext ? withContext.context : {});
  };
}

export function createFormatter() {
  return (value: Uri) => value ? value.compact : '';
}

interface WithImportedNamespaces {
  importedNamespaces: ImportedNamespace[];
}

export function createValidators(type: UriInputType, withNamespacesProvider: () => WithImportedNamespaces) {

  const result: {[key: string]: (value: Uri | string) => boolean} = {};

  if (type === 'stem') {
    result['stem'] = isValidUriStem;
  } else if (type === 'free-url') {
    result['xsd:anyURI'] = isValidUri;
    result['url'] = (value: Uri) => !value || !isValidUri(value) || isValidUrl(value);
  } else if (type === 'free-uri') {
    result['xsd:anyURI'] = isValidUri;
  } else {
    result['xsd:anyURI'] = isValidUri;
    result['unknownNS'] = (value: Uri) => !value || !isValidUri(value) || value.resolves();
    result['idNameRequired'] = (value: Uri) => !value || !isValidUri(value) || !value.resolves() || value.name.length > 0;

    if (type === 'required-namespace') {
      const isRequiredNamespace = (ns: string) => anyMatching(withNamespacesProvider().importedNamespaces, importedNamespace => importedNamespace.namespace === ns);
      result['mustBeRequiredNS'] = (value: Uri) =>  !value || !isValidUri(value) || !value.resolves() || isRequiredNamespace(value.namespace);
    }
  }

  return result;
}


@Directive({
  selector: '[uriInput][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UriInputDirective,
      multi: true
    }
  ]
})
export class UriInputDirective implements OnInit, OnChanges, Validator {
  @Input() uriInput: UriInputType;
  @Input() model: any;

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    if (!this.uriInput) {
      throw new Error('uriInput attribute is required.');
    }

    const placeholder = placeholderText(this.uriInput, this.translateService);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'placeholder', placeholder);

    this.languageService.language$.subscribe(() => {
      const placeholder = placeholderText(this.uriInput, this.translateService);
      this.renderer.setAttribute(this.elementRef.nativeElement, 'placeholder', placeholder);
    })
  }

  ngOnChanges() {
    this.model = this.model || '';
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const validators = createValidators(this.uriInput, () => this.model);
    const result = {} as any;

    Object.keys(validators).forEach((validatorName) => {
      if (!validators[validatorName](control.value)) {
        result[validatorName] = true;
      }
    });

    return Object.keys(result).length ? result : null;
  }

  registerOnValidatorChange(fn: () => void): void {}
}
