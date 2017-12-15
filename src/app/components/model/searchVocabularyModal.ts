import { IPromise, ui } from 'angular';
import IModalService = ui.bootstrap.IModalService;
import IModalServiceInstance = ui.bootstrap.IModalServiceInstance;
import { comparingLocalizable } from '../../utils/comparator';
import { comparingPrimitive } from 'yti-common-ui/utils/comparator';
import { LanguageService, Localizer } from '../../services/languageService';
import { Exclusion } from '../../utils/exclusion';
import { SearchController, SearchFilter } from '../../types/filter';
import { Vocabulary } from '../../entities/vocabulary';
import { LanguageContext } from '../../types/language';
import { VocabularyService } from '../../services/vocabularyService';
import { filterAndSortSearchResults, defaultTitleComparator } from '../filter/util';

const noExclude = (_vocabulary: Vocabulary) => null;

export class SearchVocabularyModal {
  /* @ngInject */
  constructor(private $uibModal: IModalService) {
  }

  open(context: LanguageContext, exclude: Exclusion<Vocabulary> = noExclude): IPromise<Vocabulary> {
    return this.$uibModal.open({
      template: require('./searchVocabularyModal.html'),
      size: 'medium',
      controller: SearchVocabularyController,
      controllerAs: 'ctrl',
      backdrop: true,
      resolve: {
        exclude: () => exclude,
        context: () => context
      }
    }).result;
  }
}

class SearchVocabularyController implements SearchController<Vocabulary> {

  searchResults: Vocabulary[] = [];
  vocabularies: Vocabulary[] = [];
  searchText = '';
  loadingResults: boolean;
  private localizer: Localizer;

  contentMatchers = [
    { name: 'Label', extractor: (vocabulary: Vocabulary) => vocabulary.title },
    { name: 'Description', extractor: (vocabulary: Vocabulary) => vocabulary.description }
  ];

  contentExtractors = this.contentMatchers.map(m => m.extractor);

  private searchFilters: SearchFilter<Vocabulary>[] = [];

  /* @ngInject */
  constructor(private $uibModalInstance: IModalServiceInstance,
              public exclude: Exclusion<Vocabulary>,
              vocabularyService: VocabularyService,
              languageService: LanguageService,
              public context: LanguageContext) {

    this.localizer = languageService.createLocalizer(context);
    this.loadingResults = true;

    vocabularyService.getAllVocabularies().then(vocabularies => {
      this.vocabularies = vocabularies;

      this.vocabularies.sort(
        comparingPrimitive<Vocabulary>(vocabulary => !!this.exclude(vocabulary))
          .andThen(comparingLocalizable<Vocabulary>(this.localizer, vocabulary => vocabulary.title)));

      this.search();
      this.loadingResults = false;
    });
  }

  addFilter(filter: SearchFilter<Vocabulary>) {
    this.searchFilters.push(filter);
  }

  get items() {
    return this.vocabularies;
  }

  search() {
    this.searchResults =
      filterAndSortSearchResults(
        this.vocabularies,
        this.searchText,
        this.contentExtractors,
        this.searchFilters,
        defaultTitleComparator(this.localizer, this.exclude)
      );
  }

  selectItem(vocabulary: Vocabulary) {
    if (!this.exclude(vocabulary)) {
      this.$uibModalInstance.close(vocabulary);
    }
  }

  close() {
    this.$uibModalInstance.dismiss();
  }
}
