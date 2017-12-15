import { createStory, createExpectedStateNextCondition } from 'app/help/contract';
import { KnownPredicateType } from 'app/types/entity';
import { upperCaseFirst } from 'change-case';
import { editableByTitle, input, editableFocus } from 'app/help/selectors';
import { validInput, initialInputValue, editableMarginInColumn } from 'app/help/utils';
import gettextCatalog = angular.gettext.gettextCatalog;

export function enterPredicateLabel(parent: () => JQuery, type: KnownPredicateType, initialValue: string, gettextCatalog: gettextCatalog) {

  const title = upperCaseFirst(type) + ' label';
  const enterPredicateLabelElement = editableByTitle(parent, title);
  const enterPredicateLabelInputElement = input(enterPredicateLabelElement);

  return createStory({

    title: title,
    content: title + ' info',
    popover: { element: enterPredicateLabelInputElement, position: 'left-down' },
    focus: { element: editableFocus(enterPredicateLabelElement), margin: editableMarginInColumn },
    nextCondition: createExpectedStateNextCondition(validInput(enterPredicateLabelInputElement)),
    reversible: true,
    initialize: initialInputValue(enterPredicateLabelInputElement, gettextCatalog.getString(initialValue))
  });
}
