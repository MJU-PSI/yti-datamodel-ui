// import { IPromise, IScope } from 'angular';
// import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
// import { comparingLocalizable } from 'app/utils/comparator';
// import { comparingPrimitive, selectableStatuses, Status } from '@mju-psi/yti-common-ui';
// import { LanguageService, Localizer } from 'app/services/languageService';
// import { Exclusion } from 'app/utils/exclusion';
// import { SearchController, SearchFilter } from 'app/types/filter';
// import { Vocabulary } from 'app/entities/vocabulary';
// import { LanguageContext } from 'app/types/language';
// import { VocabularyService } from 'app/services/vocabularyService';
// import { filterAndSortSearchResults, defaultTitleComparator } from 'app/components/filter/util';
// import { ifChanged } from 'app/utils/angular';

// const noExclude = (_vocabulary: Vocabulary) => null;

// export class SearchVocabularyModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(context: LanguageContext, exclude: Exclusion<Vocabulary> = noExclude): IPromise<Vocabulary> {
//     return this.$uibModal.open({
//       template: require('./searchVocabularyModal.html'),
//       size: 'md',
//       controller: SearchVocabularyController,
//       controllerAs: '$ctrl',
//       backdrop: true,
//       resolve: {
//         exclude: () => exclude,
//         context: () => context
//       }
//     }).result;
//   }
// }

// class SearchVocabularyController implements SearchController<Vocabulary> {

//   searchResults: Vocabulary[] = [];
//   vocabularies: Vocabulary[] = [];
//   searchText = '';
//   loadingResults: boolean;
//   showStatus: Status | null;
//   private localizer: Localizer;

//   contentMatchers = [
//     { name: 'Label', extractor: (vocabulary: Vocabulary) => vocabulary.title },
//     { name: 'Description', extractor: (vocabulary: Vocabulary) => vocabulary.description }
//   ];

//   contentExtractors = this.contentMatchers.map(m => m.extractor);

//   private searchFilters: SearchFilter<Vocabulary>[] = [];

//   constructor($scope: IScope,
//               private $uibModalInstance: IModalServiceInstance,
//               public exclude: Exclusion<Vocabulary>,
//               vocabularyService: VocabularyService,
//               languageService: LanguageService,
//               public context: LanguageContext) {
//     'ngInject';
//     this.localizer = languageService.createLocalizer(context);
//     this.loadingResults = true;

//     vocabularyService.getAllVocabularies().then(vocabularies => {
//       this.vocabularies = vocabularies;

//       this.vocabularies.sort(
//         comparingPrimitive<Vocabulary>(vocabulary => !!this.exclude(vocabulary))
//           .andThen(comparingLocalizable<Vocabulary>(this.localizer, vocabulary => vocabulary.title)));

//       this.search();
//       this.loadingResults = false;
//     });

//     this.addFilter(vocabulary =>
//       !this.showStatus || vocabulary.item.status === this.showStatus
//     );

//     $scope.$watch(() => this.showStatus, ifChanged<Status|null>(() => this.search()));
//   }

//   addFilter(filter: SearchFilter<Vocabulary>) {
//     this.searchFilters.push(filter);
//   }

//   get items() {
//     return this.vocabularies;
//   }

//   get statuses() {
//     return selectableStatuses;
//   }

//   search() {
//     this.searchResults =
//       filterAndSortSearchResults(
//         this.vocabularies,
//         this.searchText,
//         this.contentExtractors,
//         this.searchFilters,
//         defaultTitleComparator(this.localizer, this.exclude)
//       );
//   }

//   selectItem(vocabulary: Vocabulary) {
//     if (!this.exclude(vocabulary)) {
//       this.$uibModalInstance.close(vocabulary);
//     }
//   }

//   close() {
//     this.$uibModalInstance.dismiss('cancel');
//   }
// }


import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { comparingLocalizable } from 'app/utils/comparator';
import { comparingPrimitive, selectableStatuses, Status } from '@mju-psi/yti-common-ui';
import { LanguageService, Localizer } from 'app/services/languageService';
import { Exclusion } from 'app/utils/exclusion';
import { SearchController, SearchFilter } from 'app/types/filter';
import { Vocabulary } from 'app/entities/vocabulary';
import { LanguageContext } from 'app/types/language';
import { filterAndSortSearchResults, defaultTitleComparator } from 'app/components/filter/util';
import { DefaultVocabularyService } from 'app/services/vocabularyService';

const noExclude = (_vocabulary: Vocabulary) => null;

@Injectable({
  providedIn: 'root'
})
export class SearchVocabularyModal {

  constructor(private modalService: NgbModal) {}

  open(context: LanguageContext, exclude: Exclusion<Vocabulary> = noExclude): Promise<Vocabulary> {
    const modalRef: NgbModalRef  = this.modalService.open(SearchVocabularyController, { size: 'md' });
    modalRef.componentInstance.exclude = exclude;
    modalRef.componentInstance.context = context;
    return modalRef.result;
  }
}

@Component({
  selector: 'search-vocabulary-modal',
  templateUrl: './searchVocabularyModal.html'
})
export class SearchVocabularyController implements SearchController<Vocabulary> {
  exclude: Exclusion<Vocabulary>;
  context: LanguageContext;

  searchResults: Vocabulary[] = [];
  vocabularies: Vocabulary[] = [];
  searchText = '';
  loadingResults = true;
  showStatus: Status | null = null;
  private localizer: Localizer;

  contentMatchers = [
    { name: 'Label', extractor: (vocabulary: Vocabulary) => vocabulary.title },
    { name: 'Description', extractor: (vocabulary: Vocabulary) => vocabulary.description }
  ];

  contentExtractors = this.contentMatchers.map(m => m.extractor);

  private searchFilters: SearchFilter<Vocabulary>[] = [];

  constructor(
    public modal: NgbActiveModal,
    private vocabularyService: DefaultVocabularyService,
    private languageService: LanguageService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.localizer = this.languageService.createLocalizer(this.context);

    this.vocabularyService.getAllVocabularies().then(vocabularies => {
      this.vocabularies = vocabularies;

      this.vocabularies.sort(
        comparingPrimitive<Vocabulary>(vocabulary => !!this.exclude(vocabulary))
          .andThen(comparingLocalizable<Vocabulary>(this.localizer, vocabulary => vocabulary.title))
      );

      this.search();
    })
    .finally(() => {
      this.loadingResults = false;
    });

    this.addFilter(vocabulary => !this.showStatus || vocabulary.item.status === this.showStatus);
  }

  addFilter(filter: SearchFilter<Vocabulary>) {
    this.searchFilters.push(filter);
  }

  get items() {
    return this.vocabularies;
  }

  get statuses() {
    return selectableStatuses;
  }

  search() {
    this.searchResults = filterAndSortSearchResults(
      this.vocabularies,
      this.searchText,
      this.contentExtractors,
      this.searchFilters,
      defaultTitleComparator(this.localizer, this.exclude)
    );
  }

  selectItem(vocabulary: Vocabulary) {
    if (!this.exclude(vocabulary)) {
      this.modal.close(vocabulary);
    }
  }

  close() {
    this.modal.dismiss('cancel');
  }
}
