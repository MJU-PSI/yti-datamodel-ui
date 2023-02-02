import { IPromise, IScope } from 'angular';
import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
import { LanguageService } from '../../services/languageService';
import { ModelService } from '../../services/modelService';
import { AddEditNamespaceModal } from './addEditNamespaceModal';
import { comparingPrimitive } from '@mju-psi/yti-common-ui';
import { LanguageContext } from '../../types/language';
import { Exclusion } from '../../utils/exclusion';
import { SearchController, SearchFilter, TextAnalysis } from '../../types/filter';
import { ifChanged, modalCancelHandler } from '../../utils/angular';
import { ImportedNamespace } from '../../entities/model';
import { filterAndSortSearchResults } from '../../components/filter/util';

const noExclude = (_ns: ImportedNamespace) => null;

export class SearchNamespaceModal {

  constructor(private $uibModal: IModalService) {
    'ngInject';
  }

  open(context: LanguageContext, reservedPrefixes: string[], usedNamespaces: string[], exclude: Exclusion<ImportedNamespace> = noExclude): IPromise<ImportedNamespace> {
    return this.$uibModal.open({
      template: require('./searchNamespaceModal.html'),
      size: 'md',
      controller: SearchNamespaceController,
      controllerAs: '$ctrl',
      backdrop: true,
      resolve: {
        exclude: () => exclude,
        context: () => context,
        reservedPrefixes: () => reservedPrefixes,
        usedNamespaces: () => usedNamespaces
      }
    }).result;
  }
}

class SearchNamespaceController implements SearchController<ImportedNamespace> {

  searchResults: ImportedNamespace[];
  namespaces: ImportedNamespace[];
  searchText = '';
  showTechnical: boolean;
  loadingResults: boolean;

  contentExtractors = [ (ns: ImportedNamespace) => ns.namespace, (ns: ImportedNamespace) => ns.label ];
  private searchFilters: SearchFilter<ImportedNamespace>[] = [];

  constructor($scope: IScope,
              private $uibModalInstance: IModalServiceInstance,
              public exclude: Exclusion<ImportedNamespace>,
              private context: LanguageContext,
              private reservedPrefixes: string[],
              private usedNamespaces: string[],
              modelService: ModelService,
              private languageService: LanguageService,
              private addEditNamespaceModal: AddEditNamespaceModal) {
    'ngInject';
    this.loadingResults = true;

    modelService.getAllImportableNamespaces().then(result => {
      this.namespaces = result;
      this.search();
      this.loadingResults = false;
    });

    this.addFilter(ns =>
      this.showTechnical || !!this.searchText || !ns.item.technical
    );

    $scope.$watch(() => this.showTechnical, ifChanged(() => this.search()));
  }

  addFilter(filter: SearchFilter<ImportedNamespace>) {
    this.searchFilters.push(filter);
  }

  get items() {
    return this.namespaces;
  }

  search() {
    const comparator = comparingPrimitive<TextAnalysis<ImportedNamespace>>(item => !!this.exclude(item.item))
      .andThen(comparingPrimitive<TextAnalysis<ImportedNamespace>>(item => item.item.namespace));

    this.searchResults = filterAndSortSearchResults(this.namespaces, this.searchText, this.contentExtractors, this.searchFilters, comparator);
  }

  textFilter(ns: ImportedNamespace) {
    const search = this.searchText.toLowerCase();

    function contains(text: string): boolean {
      return (text || '').toLowerCase().includes(search);
    }

    return !this.searchText || contains(this.languageService.translate(ns.label, this.context)) || contains(ns.namespace);
  }

  selectItem(ns: ImportedNamespace) {
    if (!this.exclude(ns)) {
      this.$uibModalInstance.close(ns);
    }
  }

  createNew() {

    const language = this.languageService.getModelLanguage(this.context);

    this.addEditNamespaceModal.openAdd(this.context, language, this.reservedPrefixes, this.usedNamespaces)
      .then(ns => this.$uibModalInstance.close(ns), modalCancelHandler);
  }

  close() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
