import { IPromise, IScope, ui } from 'angular';
import IModalService = ui.bootstrap.IModalService;
import IModalServiceInstance = ui.bootstrap.IModalServiceInstance;
import { SearchConceptModal, EntityCreation } from './searchConceptModal';
import { ClassService } from '../../services/classService';
import { LanguageService, Localizer } from '../../services/languageService';
import { AddNew } from '../common/searchResults';
import gettextCatalog = angular.gettext.gettextCatalog;
import { EditableForm } from '../form/editableEntityController';
import { glyphIconClassForType } from '../../utils/entity';
import { Exclusion } from '../../utils/exclusion';
import { SearchFilter, SearchController } from '../../types/filter';
import { AbstractClass, Class, ClassListItem } from '../../entities/class';
import { Model } from '../../entities/model';
import { ExternalEntity } from '../../entities/externalEntity';
import { filterAndSortSearchResults, defaultLabelComparator } from '../filter/util';
import { Optional } from 'yti-common-ui/utils/object';

export const noExclude = (_item: AbstractClass) => null;
export const defaultTextForSelection = (_klass: Class) => 'Use class';

export class SearchClassModal {
  /* @ngInject */
  constructor(private $uibModal: IModalService) {
  }

  private openModal(model: Model,
                    exclude: Exclusion<AbstractClass>,
                    defaultToCurrentModel: boolean,
                    onlySelection: boolean,
                    textForSelection: (klass: Optional<Class>) => string) {

    return this.$uibModal.open({
      template: require('./searchClassModal.html'),
      size: 'large',
      controller: SearchClassController,
      controllerAs: 'ctrl',
      backdrop: true,
      resolve: {
        model: () => model,
        exclude: () => exclude,
        defaultToCurrentModel: () => defaultToCurrentModel,
        onlySelection: () => onlySelection,
        textForSelection: () => textForSelection
      }
    }).result;
  }

  open(model: Model,
       exclude: Exclusion<AbstractClass>,
       textForSelection: (klass: Optional<Class>) => string): IPromise<ExternalEntity|EntityCreation|Class> {

    return this.openModal(model, exclude, false, false, textForSelection);
  }

  openWithOnlySelection(model: Model,
                        defaultToCurrentModel: boolean,
                        exclude: Exclusion<AbstractClass>,
                        textForSelection: (klass: Optional<Class>) => string = defaultTextForSelection): IPromise<Class> {

    return this.openModal(model, exclude, defaultToCurrentModel, true, textForSelection);
  }
}

export interface SearchClassScope extends IScope {
  form: EditableForm;
}

class SearchClassController implements SearchController<ClassListItem> {

  private classes: ClassListItem[] = [];

  close = this.$uibModalInstance.dismiss;
  searchResults: (ClassListItem|AddNewClass)[] = [];
  selection: Class|ExternalEntity;
  searchText = '';
  cannotConfirm: string|null;
  loadingResults: boolean;
  selectedItem: ClassListItem|AddNewClass;
  excludeError: string|null = null;

  // undefined means not fetched, null means does not exist
  externalClass: Class|null|undefined;

  private localizer: Localizer;

  contentMatchers = [
    { name: 'Label', extractor: (klass: ClassListItem) => klass.label },
    { name: 'Description', extractor: (klass: ClassListItem) => klass.comment },
    { name: 'Identifier', extractor: (klass: ClassListItem) => klass.id.compact }
  ];

  contentExtractors = this.contentMatchers.map(m => m.extractor);

  searchFilters: SearchFilter<ClassListItem>[] = [];

  /* @ngInject */
  constructor(private $scope: SearchClassScope,
              private $uibModalInstance: IModalServiceInstance,
              private classService: ClassService,
              languageService: LanguageService,
              public model: Model,
              public exclude: Exclusion<AbstractClass>,
              public defaultToCurrentModel: boolean,
              public onlySelection: boolean,
              public textForSelection: (klass: Optional<Class>) => string,
              private searchConceptModal: SearchConceptModal,
              private gettextCatalog: gettextCatalog) {

    this.localizer = languageService.createLocalizer(model);
    this.loadingResults = true;

    const appendResults = (classes: ClassListItem[]) => {
      this.classes = this.classes.concat(classes);
      this.search();
      this.loadingResults = false;
    };

    classService.getAllClasses(model).then(appendResults);

    if (model.isOfType('profile')) {
      classService.getExternalClassesForModel(model).then(appendResults);
    }

    $scope.$watch(() => this.selection && this.selection.id, selectionId => {
      if (selectionId && this.selection instanceof ExternalEntity) {
        this.externalClass = undefined;
        classService.getExternalClass(selectionId, model).then(klass => this.externalClass = klass);
      }
    });
  }

  get items() {
    return this.classes;
  }

  addFilter(searchFilter: SearchFilter<ClassListItem>) {
    this.searchFilters.push(searchFilter);
  }

  isSelectionExternalEntity(): boolean {
    return this.selection instanceof ExternalEntity;
  }

  search() {
    this.searchResults = [
      new AddNewClass(
        `${this.gettextCatalog.getString('Create new class')} '${this.searchText}'`,
        this.canAddNew.bind(this),
        false
      ),
      new AddNewClass(
        `${this.gettextCatalog.getString('Create new shape')} ${this.gettextCatalog.getString('by referencing external uri')}`,
        () => this.canAddNew() && this.model.isOfType('profile'),
        true),
      ...filterAndSortSearchResults(this.classes, this.searchText, this.contentExtractors, this.searchFilters, defaultLabelComparator(this.localizer, this.exclude))
    ];
  }

  canAddNew() {
    return !this.onlySelection && !!this.searchText;
  }

  selectItem(item: ClassListItem|AddNewClass) {
    this.selectedItem = item;
    this.externalClass = undefined;
    this.excludeError = null;
    this.$scope.form.editing = false;
    this.$scope.form.$setPristine();

    if (item instanceof AddNewClass) {
      if (item.external) {
        this.$scope.form.editing = true;
        this.selection = new ExternalEntity(this.localizer.language, this.searchText, 'class');
      } else {
        this.createNewClass();
      }
    } else if (item instanceof ClassListItem || item instanceof Class /* FIXME: help needs to accept full entities instead of list items */) {
      this.cannotConfirm = this.exclude(item);

      if (this.model.isNamespaceKnownToBeNotModel(item.definedBy.id.toString())) {
        this.classService.getExternalClass(item.id, this.model).then(result => this.selection = result);
      } else {
        this.classService.getClass(item.id, this.model).then(result => this.selection = result);
      }
    } else {
      throw new Error('Unsupported item: ' + item);
    }
  }

  loadingSelection(item: ClassListItem|AddNewClass) {
    const selection = this.selection;
    if (item instanceof ClassListItem) {
      return item === this.selectedItem && (!selection || (selection instanceof Class && !item.id.equals(selection.id)));
    } else {
      return false;
    }
  }

  isExternalClassPending() {
    return this.isSelectionExternalEntity() && this.externalClass === undefined;
  }

  confirm() {
    const selection = this.selection;

    if (selection instanceof Class) {
      this.$uibModalInstance.close(this.selection);
    } else if (selection instanceof ExternalEntity) {
      if (this.externalClass) {
        const exclude = this.exclude(this.externalClass);
        if (exclude) {
          this.excludeError = exclude;
        } else {
          this.$uibModalInstance.close(this.externalClass);
        }
      } else {
        this.$uibModalInstance.close(selection);
      }
    } else {
      throw new Error('Unsupported selection: ' + selection);
    }
  }

  createNewClass() {
    return this.searchConceptModal.openNewEntityCreation(this.model.modelVocabularies, this.model, 'class', this.searchText)
      .then(conceptCreation => this.$uibModalInstance.close(conceptCreation));
  }
}

class AddNewClass extends AddNew {
  constructor(public label: string, public show: () => boolean, public external: boolean) {
    super(label, show, glyphIconClassForType(['class']));
  }
}
