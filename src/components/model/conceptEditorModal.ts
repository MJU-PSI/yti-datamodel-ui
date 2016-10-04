import { IScope, ui } from 'angular';
import IModalService = ui.bootstrap.IModalService;
import IModalServiceInstance = ui.bootstrap.IModalServiceInstance;
import gettextCatalog = angular.gettext.gettextCatalog;
import { ConceptService } from '../../services/conceptService';
import { LanguageService, Localizer } from '../../services/languageService';
import { Model, Concept, DefinedBy, ConceptSuggestion, Vocabulary, ConceptType } from '../../services/entities';
import { comparingLocalizable } from '../../services/comparators';
import { ConfirmationModal } from '../common/confirmationModal';
import { ConceptViewController } from './conceptView';
import { any } from '../../utils/array';
import { Uri } from '../../services/uri';
import { localizableContains } from '../../utils/language';
import * as _ from 'lodash';
import { isDefined } from '../../utils/object';

export class ConceptEditorModal {

  /* @ngInject */
  constructor(private $uibModal: IModalService) {
  }

  open(model: Model) {
    return this.$uibModal.open({
      template: require('./conceptEditorModal.html'),
      size: 'large',
      controller: ConceptEditorModalController,
      controllerAs: 'ctrl',
      backdrop: 'static',
      resolve: {
        model: () => model
      }
    }).result;
  }
}

export class ConceptEditorModalController {

  concepts: Concept[] = [];
  searchResults: Concept[] = [];
  selection: Concept;

  models: DefinedBy[] = [];
  vocabularies: Vocabulary[] = [];
  showModel: DefinedBy;
  showVocabulary: Vocabulary;
  showConceptType: ConceptType;
  searchText: string = '';

  loadingResults: boolean;
  editInProgress = () => this.view.isEditing();

  view: ConceptViewController;
  private localizer: Localizer;

  /* @ngInject */
  constructor($scope: IScope,
              private $uibModalInstance: IModalServiceInstance,
              languageService: LanguageService,
              public gettextCatalog: gettextCatalog,
              conceptService: ConceptService,
              private confirmationModal: ConfirmationModal,
              public model: Model) {

    this.localizer = languageService.createLocalizer(model);
    this.loadingResults = true;

    conceptService.getConceptsForModel(model)
      .then(concepts => {
        this.concepts = concepts;
        this.models = _.chain(concepts)
          .filter(concept => concept instanceof ConceptSuggestion && !!concept.definedBy)
          .map(concept => concept as ConceptSuggestion)
          .map(concept => concept.definedBy!)
          .uniqBy(definedBy => definedBy.id.uri)
          .value();

        this.vocabularies = _.chain(concepts)
          .map(concept => concept.vocabularies)
          .flatten<Vocabulary|Uri>()
          .filter(vocabulary => vocabulary instanceof Vocabulary && !vocabulary.local)
          .map(vocabulary => vocabulary as Vocabulary)
          .uniqBy(vocabulary => vocabulary.vocabularyId)
          .value();

        this.sort();
        this.search();
        this.loadingResults = false;
      });

    $scope.$watch(() => this.localizer.language, () => this.sort());
    $scope.$watch(() => this.searchText, () => this.search());
    $scope.$watch(() => this.showModel, () => this.search());
    $scope.$watch(() => this.showVocabulary, () => this.search());
    $scope.$watch(() => this.showConceptType, () => this.search());

    $scope.$on('modal.closing', event => {
      if (this.editInProgress()) {
        event.preventDefault();
        this.confirmationModal.openEditInProgress().then(() => {
          this.view.cancelEditing();
          this.$uibModalInstance.close();
        });
      }
    });
  }

  sort() {
    const labelComparator = comparingLocalizable<Concept|DefinedBy>(this.localizer, definedBy => definedBy.label);
    this.concepts.sort(labelComparator);
    this.models.sort(labelComparator);
  }

  getConceptIndex(concept: Concept) {
    for (let i = 0; i < this.concepts.length; i++) {
      if (this.concepts[i].id.equals(concept.id)) {
        return i;
      }
    }

    throw new Error('Concept not found ' + concept.id.compact);
  }

  selectionEdited(concept: Concept) {
    this.concepts.splice(this.getConceptIndex(concept), 1, concept);
    this.sort();
    this.search();
  }

  selectionDeleted(concept: Concept) {
    this.concepts.splice(this.getConceptIndex(concept), 1);
    this.search();
  }

  registerView(view: ConceptViewController) {
    this.view = view;
  }

  search() {
    this.searchResults = this.concepts.filter(concept =>
      this.textFilter(concept) &&
      this.modelFilter(concept) &&
      this.vocabularyFilter(concept) &&
      this.conceptTypeFilter(concept)
    );
  }

  private textFilter(concept: Concept): boolean {
    return !this.searchText || localizableContains(concept.label, this.searchText);
  }

  private modelFilter(concept: Concept): boolean {
    return !this.showModel || (concept instanceof ConceptSuggestion && isDefined(concept.definedBy) && concept.definedBy.id.equals(this.showModel.id));
  }

  private vocabularyFilter(concept: Concept): boolean {
    return !this.showVocabulary || any(concept.getVocabularyNames(), vocabulary => vocabulary.id.equals(this.showVocabulary.id));
  }

  private conceptTypeFilter(concept: Concept): boolean {
    return !this.showConceptType
      || this.showConceptType === 'conceptSuggestion' && concept.isOfType(this.showConceptType)
      || this.showConceptType === 'concept' && !concept.isOfType('conceptSuggestion');
  }

  selectItem(item: Concept) {
    this.view.cancelEditing();
    this.selection = item;
  }

  close() {
    this.$uibModalInstance.close();
  }
}

