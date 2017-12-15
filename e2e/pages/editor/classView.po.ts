import { EditableEntityButtons } from '../common/component/editableEntityButtons.po';
import { NavBar } from '../common/navbar.po';
import { ClassForm } from './classForm.po';
import { ClassType } from '../../../src/app/types/entity';
import ElementFinder = protractor.ElementFinder;
import { SearchPredicateModal } from './modal/searchPredicateModal.po';
import { assertNever } from 'yti-common-ui/utils/object';
import { PropertyDescriptor } from '../../util/resource';
import EC = protractor.ExpectedConditions;
import { defaultTimeout } from '../../util/expectation';

const navbar = new NavBar();

class ClassViewButtons extends EditableEntityButtons {

  addPropertyButton: ElementFinder;

  constructor(context: ElementFinder) {
    super(context);
    this.addPropertyButton = this.element.$('button.add-property');
  }
}

export class ClassView {

  element = element(by.css('class-view'));
  buttons = new ClassViewButtons(this.element);
  form = new ClassForm(this.element, this.type);

  constructor(private type: ClassType) {
    browser.wait(EC.visibilityOf(this.element), defaultTimeout);
  }

  addProperty(property: PropertyDescriptor) {

    this.buttons.addPropertyButton.click();
    const searchPredicate = new SearchPredicateModal();

    searchPredicate.search(property.origin.name);

    switch (property.origin.type) {
      case 'conceptSuggestion':
        const suggestionModal = searchPredicate.selectAddNew(property.type);
        suggestionModal.suggestNewConcept();
        suggestionModal.definition.appendValue('Definition');
        suggestionModal.confirm();
        searchPredicate.confirm();
        break;
      case 'existingConcept':
        const conceptModal = searchPredicate.selectAddNew(property.type);
        conceptModal.selectResultById(property.origin.conceptId);
        conceptModal.confirm();
        searchPredicate.confirm();
        break;
      case 'existingResource':
        searchPredicate.selectResultById(property.origin.id);
        searchPredicate.confirm();
        break;
      case 'externalResource':
        searchPredicate.selectAddNewExternal();
        searchPredicate.externalIdElement.setValue(property.origin.id);
        searchPredicate.confirm();
        break;
      default:
        assertNever(property.origin);
    }

    browser.sleep(800); // wait for scroll
  }

  edit() {
    this.buttons.edit();
  }

  reload() {
    browser.refresh();
    navbar.ensureLoggedIn();
  }

  saveAndReload() {
    this.buttons.save();
    this.reload();
  }
}
