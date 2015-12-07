import IFilterService = angular.IFilterService;
import { ConfirmationModal } from './confirmationModal';
import { DeleteConfirmationModal } from './deleteConfirmationModal';
import { LanguageService } from '../../services/languageService';
import { Localizable } from '../../services/entities';

const mod = angular.module('iow.components.common', []);
export = mod.name;

import './accordionChevron';
import './ajaxLoadingIndicator';
import './float';
import './keyControl';
import './keyControlItem';
import './modalTemplate';
import './typeahead';

mod.service('confirmationModal', ConfirmationModal);
mod.service('deleteConfirmationModal', DeleteConfirmationModal);

mod.filter('translateValue', (languageService: LanguageService) => {
  'ngInject';
  return (input: Localizable) => input ? languageService.translate(input) : '';
});

mod.filter('translateLabel', (translateValueFilter: any) => {
  'ngInject';
  return (input: {label: Localizable}) => input ? translateValueFilter(input.label) : '';
});

mod.filter('orderByLabel', (translateLabelFilter: IFilterService, orderByFilter: any) => {
  'ngInject';
  return (array: {label: Localizable}[]) => {
    return orderByFilter(array, translateLabelFilter);
  };
});
