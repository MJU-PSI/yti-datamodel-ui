/// <reference types="protractor" />
/// <reference types="jasmine" />

import { ModelPage, NewModelParameters } from '../pages/model/modelPage.po';
import { expectCurrentUrlToEqualPath } from '../util/url';
import { library1Parameters, library2Parameters, profileParameters } from './test-data';
import { NavBar } from '../pages/common/navbar.po';
import { FrontPage } from '../pages/frontPage.po';

describe('Model page', () => {

  const navbar = new NavBar();

  describe('Before models are created', () => {

    const createLibraryAndCheckExpectations = (parameters: NewModelParameters) => {

      FrontPage.navigate();
      navbar.ensureLoggedIn();

      const page = ModelPage.navigateToNewModel(parameters);
      page.modelView.buttons.save();
      expectCurrentUrlToEqualPath(ModelPage.pathToExistingModel(parameters.prefix));
    };

    it('Creates saved model', () => {
      createLibraryAndCheckExpectations(library1Parameters);
    });

    it('Creates another model', () => {
      createLibraryAndCheckExpectations(library2Parameters);
    });

    it('Creates profile', () => {
      createLibraryAndCheckExpectations(profileParameters);
    });
  });

  describe('After model is created', () => {

    require('./modelView.e2e');
    require('./addResources.e2e');
    require('./classView.e2e');
    require('./predicateView.e2e');
    require('./conceptEditor.e2e');
    require('./modelView.clean.e2e');

    const removeLibraryAndCheckExpectations = (parameters: NewModelParameters) => {
      const page = ModelPage.navigateToExistingModel(parameters.prefix, parameters.type);
      navbar.ensureLoggedIn();
      page.modelView.ensureOpen();
      page.modelView.buttons.removeAndConfirm();
      // TODO FIXME
      // expectCurrentUrlToEqualPath(GroupPage.path(parameters.groupId));
    };

    it('Removes model', () => {
      removeLibraryAndCheckExpectations(library1Parameters);
    });

    it('Removes another model', () => {
      removeLibraryAndCheckExpectations(library2Parameters);
    });

    it('Removes profile', () => {
      removeLibraryAndCheckExpectations(profileParameters);
    });
  });
});
