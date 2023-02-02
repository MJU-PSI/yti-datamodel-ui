import { componentDeclaration } from 'app/utils/angular';
import { module11 as mod } from './module';

import { comparingPrimitive, flatten, availableLanguages } from '@mju-psi/yti-common-ui';
import { InteractiveHelpBackdropComponent } from './components/interactiveHelpBackdrop';
import { InteractiveHelpDisplay } from './components/interactiveHelpDisplay';
import { InteractiveHelpPopoverComponent } from './components/interactiveHelpPopover';
import { InteractiveHelpPopoverDimensionsCalculatorComponent } from './components/interactiveHelpPopoverDimensionsCalculator';
import { InteractiveHelp } from './contract';
import { FrontPageHelpService } from './providers/frontPageHelpService';
import { HelpBuilderService } from './providers/helpBuilderService';
import { ModelPageHelpService } from './providers/modelPageHelpService';
import { InteractiveHelpClassService } from './services/helpClassService';
import { InteractiveHelpModelService } from './services/helpModelService';
import { InteractiveHelpOrganizationService } from './services/helpOrganizationService';
import { InteractiveHelpPredicateService } from './services/helpPredicateService';
import { InteractiveHelpUserService } from './services/helpUserService';
import { InteractiveHelpValidatorService } from './services/helpValidatorService';
import { InteractiveHelpVisualizationService } from './services/helpVisualizationService';
import { InteractiveHelpVocabularyService } from './services/helpVocabularyService';
import { InteractiveHelpService } from './services/interactiveHelpService';

export { module11 } from './module';

const logTranslations = false;

mod.component('helpPopover', componentDeclaration(InteractiveHelpPopoverComponent));
mod.component('helpPopoverDimensionsCalculator', componentDeclaration(InteractiveHelpPopoverDimensionsCalculatorComponent));
mod.component('helpBackdrop', componentDeclaration(InteractiveHelpBackdropComponent));

mod.service('interactiveHelpService', InteractiveHelpService);
mod.service('helpModelService', InteractiveHelpModelService);
mod.service('helpClassService', InteractiveHelpClassService);
mod.service('helpPredicateService', InteractiveHelpPredicateService);
mod.service('helpUserService', InteractiveHelpUserService);
mod.service('helpVocabularyService', InteractiveHelpVocabularyService);
mod.service('helpVisualizationService', InteractiveHelpVisualizationService);
mod.service('helpValidatorService', InteractiveHelpValidatorService);
mod.service('helpOrganizationService', InteractiveHelpOrganizationService);

mod.service('frontPageHelpService', FrontPageHelpService);
mod.service('modelPageHelpService', ModelPageHelpService);

mod.service('interactiveHelpDisplay', InteractiveHelpDisplay);
mod.service('helpBuilderService', HelpBuilderService);

mod.run((
  frontPageHelpService: FrontPageHelpService,
  modelPageHelpService: ModelPageHelpService
) => {
  'ngInject';

  if (logTranslations) {
    const availableUILanguages = availableLanguages.map((lang: { code: any; }) => { return lang.code });

    logTranslation(flatten(availableUILanguages.map(lang => [
      ...frontPageHelpService.getHelps(lang),
      ...modelPageHelpService.getHelps('library', 'bogusPrefix', lang),
      ...modelPageHelpService.getHelps('profile', 'bogusPrefix', lang)
    ])));
  }
});

function logTranslation(helps: InteractiveHelp[]) {

  const translations: { key: string, context?: any }[] = [];

  for (const help of helps) {
    const storyLine = help.storyLine;

    translations.push({ key: storyLine.title });
    translations.push({ key: storyLine.description });

    for (const item of storyLine.items()) {
      translations.push(item.title);

      if (item.content) {
        translations.push(item.content);
      }
    }
  }

  translations.sort(comparingPrimitive(translation => translation.key));

  let result = '';
  let previousKey = '';

  for (const {key, context} of translations) {

    const contextKeys = Object.keys(context || {}).map(k => `{{${k}}}`).join(' ');

    if (key !== previousKey) {
      result += `<div translate>${key}</div> ${contextKeys}\n`;
    }

    previousKey = key;
  }

  console.log(result);
}
