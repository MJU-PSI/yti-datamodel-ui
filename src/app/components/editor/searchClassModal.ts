import { IPromise, IScope } from 'angular';
import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
import { SearchConceptModal, EntityCreation } from './searchConceptModal';
import { ClassService } from 'app/services/classService';
import { LanguageService, Localizer } from 'app/services/languageService';
import { AddNew } from 'app/components/common/searchResults';
import { gettextCatalog as GettextCatalog } from 'angular-gettext';
import { EditableForm } from 'app/components/form/editableEntityController';
import { glyphIconClassForType } from 'app/utils/entity';
import { Exclusion } from 'app/utils/exclusion';
import { SearchFilter, SearchController } from 'app/types/filter';
import { AbstractClass, Class, ClassListItem } from 'app/entities/class';
import { Model } from 'app/entities/model';
import { ExternalEntity } from 'app/entities/externalEntity';
import { filterAndSortSearchResults, defaultLabelComparator } from 'app/components/filter/util';
import { Optional, requireDefined, ignoreModalClose } from '@goraresult/yti-common-ui';

export const noExclude = (_item: AbstractClass) => null;
export const defaultTextForSelection = (_klass: Class) => 'Use class';

export class SearchClassModal {

  constructor(private $uibModal: IModalService) {
    'ngInject';
  }

  private openModal(model: Model,
                    exclude: Exclusion<AbstractClass>,
                    defaultToCurrentModel: boolean,
                    onlySelection: boolean,
                    textForSelection: (klass: Optional<Class | ExternalEntity>) => string,
                    requiredByInUse: boolean = false) {

    return this.$uibModal.open({
      template: require('./searchClassModal.html'),
      size: 'lg',
      controller: SearchClassController,
      controllerAs: '$ctrl',
      backdrop: true,
      resolve: {
        model: () => model,
        exclude: () => exclude,
        defaultToCurrentModel: () => defaultToCurrentModel,
        onlySelection: () => onlySelection,
        textForSelection: () => textForSelection,
        requiredByInUse: () => requiredByInUse
      }
    }).result;
  }

  open(model: Model,
       exclude: Exclusion<AbstractClass>,
       textForSelection: (klass: Optional<Class | ExternalEntity>) => string): IPromise<ExternalEntity|EntityCreation|Class> {

    return this.openModal(model, exclude, false, false, textForSelection);
  }

  openWithOnlySelection(model: Model,
                        defaultToCurrentModel: boolean,
                        exclude: Exclusion<AbstractClass>,
                        textForSelection: (klass: Optional<Class | ExternalEntity>) => string = defaultTextForSelection,
                        requiredByInUse: boolean = false): IPromise<Class> {

    return this.openModal(model, exclude, defaultToCurrentModel, true, textForSelection, requiredByInUse);
  }
}

export interface SearchClassScope extends IScope {
  form: EditableForm;
}

class SearchClassController implements SearchController<ClassListItem> {

  private classes: ClassListItem[] = [];

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

  constructor(private $scope: SearchClassScope,
              private $uibModalInstance: IModalServiceInstance,
              private classService: ClassService,
              languageService: LanguageService,
              public model: Model,
              public exclude: Exclusion<AbstractClass>,
              public defaultToCurrentModel: boolean,
              public onlySelection: boolean,
              public textForSelection: (klass: Optional<Class | ExternalEntity>) => string,
              public requiredByInUse: boolean,
              private searchConceptModal: SearchConceptModal,
              private gettextCatalog: GettextCatalog) {
    'ngInject';
    this.localizer = languageService.createLocalizer(model);
    this.loadingResults = true;

    const appendResults = (classes: ClassListItem[]) => {
      this.classes = this.classes.concat(classes);
      this.search();
      this.loadingResults = false;
    };

    if (this.requiredByInUse) {
      classService.getRequiredByClasses(model).then(appendResults);
    } else {
      classService.getAllClasses(model).then(appendResults);
    }

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

  selectItem(item: AbstractClass|AddNewClass) {
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
    } else {
      this.cannotConfirm = this.exclude(item);

      if (this.model.isNamespaceKnownToBeNotModel(item.definedBy.id.toString())) {
        this.classService.getExternalClass(item.id, this.model).then(result => {
          this.selection = requireDefined(result); // TODO check if result can actually be null
        });
      } else {
        this.classService.getClass(item.id, this.model).then(result => this.selection = result);
      }
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

  close() {
    this.$uibModalInstance.dismiss('cancel');
  }

  createNewClass() {
    return this.searchConceptModal.openNewEntityCreation(this.model.vocabularies, this.model, 'class', this.searchText)
      .then(conceptCreation => this.$uibModalInstance.close(conceptCreation), ignoreModalClose);
  }
}

class AddNewClass extends AddNew {
  constructor(public label: string, public show: () => boolean, public external: boolean) {
    super(label, show, glyphIconClassForType(['class']));
  }
}
