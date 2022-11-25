import { isDefined, Localizable, requireDefined } from '@vrk-yti/yti-common-ui';
import { IPromise, IQService } from 'angular';
import { analyze } from 'app/components/filter/textAnalyzer';
import { Uri } from 'app/entities/uri';
import { Concept, Vocabulary } from 'app/entities/vocabulary';
import { VocabularyService } from 'app/services/vocabularyService';
import { Language } from 'app/types/language';
import { EntityCreatorService } from './entityCreatorService';
import { ResetableService } from './resetableService';
import { ResourceStore } from './resourceStore';

export class InteractiveHelpVocabularyService implements VocabularyService, ResetableService {

  private conceptIndex = 0;

  vocabularyStore = new ResourceStore<Vocabulary>();
  conceptStore = new ResourceStore<Concept>();

  constructor(private $q: IQService,
              private entityCreatorService: EntityCreatorService) {
    'ngInject';
  }

  reset(): IPromise<any> {

    this.vocabularyStore.clear();
    this.conceptIndex = 0;
    this.conceptStore.clear();

    return this.$q.when();
  }

  getAllVocabularies(): IPromise<Vocabulary[]> {
    return this.$q.resolve(this.vocabularyStore.values());
  }

  searchConcepts(searchText: string, vocabulary?: Vocabulary): IPromise<Concept[]> {
    return this.$q.resolve(this.conceptStore.findAll(c => {
      const analysis = analyze(searchText, c, [x => x.label, x => x.definition]);
      return isDefined(analysis.matchScore) && (!vocabulary || vocabulary.id.equals(c.vocabulary.id));
    }));
  }

  createConceptSuggestion(vocabulary: Vocabulary, label: string, comment: string, lang: Language): IPromise<Uri> {

    return this.entityCreatorService.createConcept({
      vocabulary,
      index: ++this.conceptIndex,
      label: { [lang]: label },
      definition: { [lang]: comment }
    }).then(concept => this.conceptStore.add(concept))
      .then(concept => concept.id);
  }

  getConcept(id: Uri): IPromise<Concept> {
    return this.$q.when(requireDefined(this.conceptStore.findFirst(cs => cs.id.equals(id))));
  }

  createVocabulary(vocabulary: { prefix: string, label: Localizable, description: Localizable }): IPromise<Vocabulary> {
    return this.entityCreatorService.createVocabulary(vocabulary)
      .then(v => this.vocabularyStore.add(v));
  }

  createConcept(vocabulary: Vocabulary, concept: { label: Localizable, definition: Localizable }): IPromise<Concept> {
    return this.entityCreatorService.createConcept({
      vocabulary,
      index: ++this.conceptIndex,
      label: concept.label,
      definition: concept.definition
    }).then(c => this.conceptStore.add(c));
  }
}
