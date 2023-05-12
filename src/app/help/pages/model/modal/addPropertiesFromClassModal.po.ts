import { createStory, createExpectedStateNextCondition, Story } from 'app/help/contract';
import { modal, child } from 'app/help/utils/selector';
import * as Modal from 'app/help/pages/modal/modal.po';
import { AddPropertiesFromClassModalComponent } from 'app/components/editor/add-properties-from-class-modal';
import { arraysAreEqual } from '@mju-psi/yti-common-ui';
import { getModalController } from 'app/help/utils/angular';
import { onlyProperties } from 'app/help/utils/init';

const selectPropertiesElement = child(modal, '.properties');

export function selectProperties(title: string, expectProperties: string[]) {

  return createStory({

    title: { key: title },
    content: { key: title + ' info' },
    popover: { element: selectPropertiesElement, position: 'bottom-right' },
    focus: { element: selectPropertiesElement },
    nextCondition: createExpectedStateNextCondition(() => {

      const ctrl = getModalController<AddPropertiesFromClassModalComponent>();

      if (!expectProperties) {
        return true;
      }

      return arraysAreEqual(Object.values(ctrl.selectedProperties.map(p => p.predicateId.uri)), expectProperties);
    }),
    initialize: () => {
      if (expectProperties) {
        try {
          const ctrl = getModalController<AddPropertiesFromClassModalComponent>();
          onlyProperties(ctrl.selectedProperties, expectProperties);
        } catch (e) {
          console.log(e);
          return false;
        }
      }
      return true;
    },
    reversible: true
  });
}

export function confirmProperties(navigates: boolean) {
  return Modal.confirm(child(modal, '.add-properties-from-class'), navigates);
}

export const UseCases = {

  selectAndConfirmProperties(title: string, navigates: boolean, properties: string[]): Story[] {
    return [
      selectProperties(title, properties),
      confirmProperties(navigates)
    ];
  }
};
