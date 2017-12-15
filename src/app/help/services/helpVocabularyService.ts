import { VocabularyService } from 'app/services/vocabularyService';
import { ResetableService } from './resetableService';
import { IPromise, IQService } from 'angular';
import { Language } from 'app/types/language';
import { Vocabulary, Concept } from 'app/entities/vocabulary';
import { Uri } from 'app/entities/uri';
import { Model } from 'app/entities/model';
import * as frames from 'app/entities/frames';
import { ResourceStore } from './resourceStore';

export class InteractiveHelpVocabularyService implements VocabularyService, ResetableService {

  store = new ResourceStore<Concept>();

  /* @ngInject */
  constructor(private $q: IQService, private defaultVocabularyService: VocabularyService) {
  }

  reset(): IPromise<any> {
    this.store.clear();
    return this.$q.when();
  }

  getAllVocabularies(): IPromise<Vocabulary[]> {
    return this.defaultVocabularyService.getAllVocabularies();
  }

  searchConcepts(searchText: string, vocabulary?: Vocabulary): IPromise<Concept[]> {
    return this.defaultVocabularyService.searchConcepts(searchText, vocabulary);
  }

  createConceptSuggestion(vocabulary: Vocabulary, label: string, comment: string, _broaderConceptId: Uri|any, lang: Language, model: Model): IPromise<Concept> {

    const id = Uri.randomUUID();

    const graph = {
      '@id': id.toString(),
      'id': id.uuid,
      '@type': [ 'skos:Concept' ],
      prefLabel: { [lang]: label },
      definition: { [lang]: comment },
      inScheme: vocabulary.serialize(true, true),
      graph: vocabulary.material.serialize(true, true)
    };

    const conceptSuggestion = new Concept(graph, model.context, frames.conceptFrame);
    this.store.add(conceptSuggestion);
    return this.$q.when(conceptSuggestion);
  }

  getConcept(id: Uri): IPromise<Concept> {
    const conceptSuggestion = this.store.findFirst(cs => cs.id.equals(id));

    if (conceptSuggestion) {
      return this.$q.when(conceptSuggestion);
    } else {
      return this.defaultVocabularyService.getConcept(id);
    }
  }

  getConceptsForModel(model: Model): IPromise<Concept[]> {
    // TODO should probably return suggestions from store also
    return this.defaultVocabularyService.getConceptsForModel(model);
  }
}
