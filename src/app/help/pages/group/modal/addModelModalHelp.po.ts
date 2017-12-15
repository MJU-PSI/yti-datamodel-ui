import { createStory, createNavigatingClickNextCondition, createExpectedStateNextCondition } from 'app/help/contract';
import {
  input, modal, editableByTitle, editableFocus, editableMultipleByTitle, multiInput,
  child
} from 'app/help/selectors';
import { editableMargin, editableMultipleMargin, initialInputValue, validInput } from 'app/help/utils';
import { KnownModelType } from 'app/types/entity';
import { upperCaseFirst } from 'change-case';
import gettextCatalog = angular.gettext.gettextCatalog;


export function enterModelPrefix(prefix: string) {

  const enterModelPrefixElement = editableByTitle(modal, 'Prefix');
  const enterModelPrefixInputElement = input(enterModelPrefixElement);

  return createStory({

    title: 'Prefix',
    content: 'Prefix info',
    popover: { element: enterModelPrefixInputElement, position: 'left-down' },
    focus: { element: editableFocus(enterModelPrefixElement), margin: editableMargin },
    nextCondition: createExpectedStateNextCondition(validInput(enterModelPrefixInputElement)),
    reversible: true,
    initialize: initialInputValue(enterModelPrefixInputElement, prefix)
  });
}

export function enterModelLabel(type: KnownModelType, label: string, gettextCatalog: gettextCatalog) {

  const title = upperCaseFirst(type) + ' label';
  const enterModelLabelElement = editableByTitle(modal, title);
  const enterModelLabelInputElement = input(enterModelLabelElement);

  return createStory({

    title: title,
    content: title + ' info',
    popover: { element: enterModelLabelInputElement, position: 'left-down' },
    focus: { element: editableFocus(enterModelLabelElement), margin: editableMargin },
    nextCondition: createExpectedStateNextCondition(validInput(enterModelLabelInputElement)),
    reversible: true,
    initialize: initialInputValue(enterModelLabelInputElement, gettextCatalog.getString(label))
  });
}

const enterModelLanguageElement = editableMultipleByTitle(modal, 'Model languages');
const enterModelLanguageInputElement = multiInput(enterModelLanguageElement);
export const enterModelLanguage = createStory({

  title: 'Model languages',
  content: 'Model languages info',
  popover: { element: enterModelLanguageInputElement, position: 'left-down' },
  focus: { element: editableFocus(enterModelLanguageElement), margin: editableMultipleMargin },
  reversible: true,
  nextCondition: createExpectedStateNextCondition(validInput(enterModelLanguageInputElement))
});

const createModelElement = child(modal, 'button.create');
export const createModel = createStory({
  title: 'Create new',
  content: 'Create new info',
  popover: { element: createModelElement, position: 'top-left' },
  focus: { element: createModelElement },
  nextCondition: createNavigatingClickNextCondition(createModelElement)
});
