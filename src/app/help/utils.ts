import { INgModelController } from 'angular';
import { lowerCaseFirst, upperCaseFirst } from 'change-case';
import { anyMatching, contains, keepMatching } from 'yti-common-ui/utils/array';
import { Property } from 'app/entities/class';
import { createScrollWithDefault } from './contract';
import { ClassDetails, PredicateDetails } from '../services/entityLoader';
import { Language } from 'app/types/language';
import { KnownPredicateType } from 'app/types/entity';

export const editableMargin = { left: 20, right: 20, bottom: 15 };

export function getModalController<T>(controllerName = '$ctrl') {
  return (jQuery('.modal').scope() as any)[controllerName] as T;
}

function inputWithNgModel(element: () => JQuery, validate: (ngModel: INgModelController) => boolean) {
  return () => {
    const e = element();
    const ngModel: INgModelController = e.controller('ng-model');

    if (!ngModel) {
      console.log(e);
      throw new Error('No ng-model for element');
    }

    return validate(ngModel);
  };
}

export function validInput(element: () => JQuery) {
  return inputWithNgModel(element, ngModel => ngModel.$valid && !ngModel.$pending);
}

export function inputHasExactValue(element: () => JQuery, value: string) {
  return inputWithNgModel(element, ngModel => ngModel.$viewValue === value);
}

export function expectAll(...expectations: (() => boolean)[]): () => boolean {
  return () => {
    for (const expectation of expectations) {
      if (!expectation()) {
        return false;
      }
    }
    return true;
  };
}

export function elementExists(element: () => JQuery) {
  return () => {
    const e = element();
    return e && e.length > 0;
  };
}

export function initialInputValue(element: () => JQuery, value: string) {
  return () => {
    const initialInputNgModel = element().controller('ngModel');

    if (!initialInputNgModel) {
      return false;
    } else {
      initialInputNgModel.$setViewValue(value);
      initialInputNgModel.$render();
      return true;
    }
  };
}

export const scrollToTop = createScrollWithDefault(() => jQuery('body'));


function normalizeAsId(resourceName: string) {
  return resourceName
    .replace(/\s/g, '')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ä/g, 'a')
    .replace(/Ä/g, 'A')
    .replace(/å/g, 'a')
    .replace(/Å/g, 'A');
}

const baseNamespace = 'http://uri.suomi.fi/';
const dataModelNamespace = `${baseNamespace}datamodel/`;
const terminologyNamespace = `${baseNamespace}terminology/`;

export function vocabularyIdFromPrefix(prefix: string) {
  return `${terminologyNamespace}${prefix}/terminological-vocabulary-1`;
}

export function conceptIdFromPrefixAndIndex(prefix: string, index: number) {
  return `${terminologyNamespace}${prefix}/concept-${index + 1}`;
}

export function modelIdFromPrefix(modelPrefix: string) {
  return `${dataModelNamespace}ns/${modelPrefix}`
}

export function classNameToResourceIdName(className: string) {
  return normalizeAsId(upperCaseFirst(className));
}

export function predicateNameToResourceIdName(predicateName: string) {
  return normalizeAsId(lowerCaseFirst(predicateName));
}

export function classIdFromNamespaceId(namespaceId: string, name: string) {
  return namespaceId + '#' + classNameToResourceIdName(name);
}

export function classIdFromPrefixAndName(prefix: string, name: string) {
  return classIdFromNamespaceId(modelIdFromPrefix(prefix), name);
}

export function classIdAndNameFromHelpData(data: { prefix: string, details: ClassDetails }, lang: Language) {
  return {
    id: data.details.id || classIdFromPrefixAndName(data.prefix, data.details.label.fi),
    name: data.details.label[lang]
  };
}

export function predicateIdFromNamespaceId(namespaceId: string, name: string) {
  return namespaceId + '#' + predicateNameToResourceIdName(name);
}

export function predicateIdFromPrefixAndName(prefix: string, name: string) {
  return predicateIdFromNamespaceId(modelIdFromPrefix(prefix), name);
}

export function predicateIdAndNameFromHelpData(data: { type: KnownPredicateType, prefix: string, details: PredicateDetails }, lang: Language) {
  return {
    id: data.details.id || predicateIdFromPrefixAndName(data.prefix, data.details.label.fi),
    name: data.details.label[lang]
  };
}

export const isExpectedProperty = (expectedProperties: string[]) =>
  (property: Property) => anyMatching(expectedProperties, predicateUri => property.predicateId.uri === predicateUri);

export function onlyProperties(properties: Property[], expectedProperties: string[]) {
  keepMatching(properties, isExpectedProperty(expectedProperties));
}

export function moveCursorToEnd(input: JQuery) {
  if (contains(['INPUT', 'TEXTAREA'], input.prop('tagName'))) {
    const valueLength = input.val().length;
    // ensures that cursor will be at the end of the input
    if (!contains(['checkbox', 'radio'], input.attr('type'))) {
      setTimeout(() => (input[0] as HTMLInputElement).setSelectionRange(valueLength, valueLength));
    }
  }
}

export function formatSearch(name: string, length = 4) {
  return name.toLowerCase().substring(0, Math.min(length, name.length))
}
