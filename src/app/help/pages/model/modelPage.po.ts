import {
  createClickNextCondition,
  createModifyingClickNextCondition,
  createNavigatingClickNextCondition,
  createScrollWithDefault,
  createStory,
  scrollToTop,
  Story
} from 'app/help/contract';
import { child, modelPanelElement } from 'app/help/utils/selector';
import { KnownModelType, KnownPredicateType } from 'app/types/entity';
import { classIdAndNameFromHelpData } from 'app/help/utils/id';
import * as SearchClassModal from './modal/searchClassModal.po';
import * as AddPropertiesFromClass from './modal/addPropertiesFromClassModal.po';
import * as ClassView from './classView.po';
import * as ClassForm from './classForm.po';
import { Localizable } from '@mju-psi/yti-common-ui';
import { Language } from 'app/types/language';
import { ClassDetails } from 'app/services/entityLoader';

export function openModelDetails(type: KnownModelType) {

  const openModelDetailsElement = () => jQuery('#modelDetailsTab');

  return createStory({

    title: { key: `Open ${type} details` },
    content: { key: `Open ${type} details description` },
    scroll: scrollToTop,
    popover: { element: openModelDetailsElement, position: 'bottom-right' },
    focus: { element: openModelDetailsElement },
    nextCondition: createModifyingClickNextCondition(openModelDetailsElement)
  });
}

export function openAddResource(type: 'class' | KnownPredicateType) {

  const openAddResourceElement = () => jQuery('button.add-new-button');

  return createStory({
    title: { key: 'Add ' + type },
    content: { key: 'Add ' + type + ' description' },
    scroll: createScrollWithDefault(modelPanelElement),
    popover: { element: openAddResourceElement, position: 'right-down' },
    focus: { element: openAddResourceElement },
    nextCondition: createClickNextCondition(openAddResourceElement)
  });
}

export function selectClass(prefix: string, klass: ClassDetails, lang: Language) {

  const { id, name } = classIdAndNameFromHelpData({ prefix, details: klass }, lang);
  const selectClassElement = child(modelPanelElement, `li#${CSS.escape(id + '_tabset_link')}`);

  return createStory({
    title: { key: 'Select class', context: { name: name.toLowerCase() } },
    content: { key: 'Select class description', context: { name: name.toLowerCase() } },
    scroll: createScrollWithDefault(modelPanelElement),
    popover: { element: selectClassElement, position: 'right-down' },
    focus: { element: selectClassElement },
    nextCondition: createNavigatingClickNextCondition(selectClassElement)
  });
}

export const UseCases = {

  specializeClass(klass: { prefix: string, details: ClassDetails, properties: string[] }, lang: Language): Story[] {

    const { id, name } = classIdAndNameFromHelpData(klass, lang);

    return [
      openAddResource('class'),
      ...SearchClassModal.UseCases.findAndSelectExistingClass(name, id, false),
      ...AddPropertiesFromClass.UseCases.selectAndConfirmProperties('Select name and description', true, klass.properties),
      ClassForm.focusClass(ClassView.element),
      ClassView.saveClassChanges
    ];
  },
  assignClass(klass: { prefix: string, details: ClassDetails }, lang: Language): Story[] {

    const { id, name } = classIdAndNameFromHelpData(klass, lang);

    return [
      openAddResource('class'),
      ...SearchClassModal.UseCases.findAndSelectExistingClass(name, id, true),
      ClassForm.focusClass(ClassView.element)
    ];
  },
  createNewClass(klass: { label: Localizable, comment: Localizable }, lang: Language): Story[] {
    return [
      openAddResource('class'),
      ...SearchClassModal.UseCases.findAndCreateNewBasedOnConceptSuggestion(klass.label[lang], klass.comment[lang]),
      ClassForm.focusClass(ClassView.element)
    ];
  }
};
