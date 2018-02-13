import { IAttributes, ILocationService, IPromise, IQService, IScope, route } from 'angular';
import * as _ from 'lodash';
import { ClassService } from 'app/services/classService';
import { LanguageService, Localizer } from 'app/services/languageService';
import { LocationService } from 'app/services/locationService';
import { ModelService } from 'app/services/modelService';
import { PredicateService } from 'app/services/predicateService';
import { ConfirmationModal } from 'app/components/common/confirmationModal';
import { SearchClassModal } from 'app/components/editor/searchClassModal';
import { SearchPredicateModal } from 'app/components/editor/searchPredicateModal';
import { EntityCreation } from 'app/components/editor/searchConceptModal';
import { WithDefinedBy } from 'app/types/entity';
import { ChangeListener, ChangeNotifier, SearchClassType, Show } from 'app/types/component';
import { Uri } from 'app/entities/uri';
import { comparingLocalizable } from 'app/utils/comparator';
import { AddPropertiesFromClassModal } from 'app/components/editor/addPropertiesFromClassModal';
import { module as mod } from './module';
import { isDifferentUrl, modalCancelHandler, nextUrl } from 'app/utils/angular';
import {
  combineExclusions,
  createClassTypeExclusion,
  createDefinedByExclusion,
  createExistsExclusion,
  Exclusion
} from 'app/utils/exclusion';
import { collectIds, glyphIconClassForType } from 'app/utils/entity';
import { SessionService } from 'app/services/sessionService';
import { areEqual, isDefined, Optional } from 'yti-common-ui/utils/object';
import { AbstractPredicate, Predicate, PredicateListItem } from 'app/entities/predicate';
import { AbstractClass, Class, ClassListItem, Property } from 'app/entities/class';
import { Model } from 'app/entities/model';
import { ExternalEntity } from 'app/entities/externalEntity';
import { ClassType, KnownPredicateType, SelectionType } from 'app/types/entity';
import { NotificationModal } from 'app/components/common/notificationModal';
import { removeMatching } from 'yti-common-ui/utils/array';
import { ApplicationController } from 'app/components/application';
import { HelpProvider } from 'app/components/common/helpProvider';
import { InteractiveHelp } from 'app/help/contract';
import { ModelPageHelpService } from 'app/help/modelPageHelp';
import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';
import { ModelControllerService, View } from './modelControllerService';
import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
import IRouteService = route.IRouteService;
import ICurrentRoute = route.ICurrentRoute;

mod.directive('modelPage', () => {
  return {
    restrict: 'E',
    template: require('./modelPage.html'),
    controllerAs: 'ctrl',
    bindToController: true,
    controller: ModelPageController,
    require: ['modelPage', '^application'],
    link(_$scope: IScope, _element: JQuery, _attributes: IAttributes, [ctrl, applicationController]: [ModelPageController, ApplicationController]) {
      applicationController.registerHelpProvider(ctrl);
    }
  };
});

export interface ModelPageActions extends ChangeNotifier<Class|Predicate> {
  select(item: WithIdAndType): void;
  createClass(conceptCreation: EntityCreation): void;
  createShape(classOrExternal: Class|ExternalEntity, external: boolean): void;
  copyShape(shape: Class): void;
  assignClassToModel(klass: Class): void;
  createPredicate(conceptCreation: EntityCreation, type: KnownPredicateType): void;
  assignPredicateToModel(predicate: Predicate): void;
}

export class ModelPageController implements ModelPageActions, HelpProvider, ModelControllerService {

  loading = true;
  views: View[] = [];
  changeListeners: ChangeListener<Class|Predicate>[] = [];
  selectedItem: WithIdAndType|null = null;
  model: Model;
  selection: Class|Predicate|null = null;
  openPropertyId?: string;
  classes: SelectableItem[] = [];
  associations: SelectableItem[] = [];
  attributes: SelectableItem[] = [];
  selectionWidth: number;
  private _show: Show;

  activeTab = 0;
  tabs = [
    new Tab('class', () => this.classes, this),
    new Tab('attribute', () => this.attributes, this),
    new Tab('association', () => this.associations, this)
  ];

  private localizerProvider: () => Localizer;

  private initialRoute: ICurrentRoute;
  private currentRouteParams: any;

  helps: InteractiveHelp[] = [];

  /* @ngInject */
  constructor($scope: IScope,
              $location: ILocationService,
              private $route: IRouteService,
              private $q: IQService,
              private locationService: LocationService,
              private modelService: ModelService,
              private classService: ClassService,
              private predicateService: PredicateService,
              private searchClassModal: SearchClassModal,
              private searchPredicateModal: SearchPredicateModal,
              private confirmationModal: ConfirmationModal,
              private notificationModal: NotificationModal,
              private addPropertiesFromClassModal: AddPropertiesFromClassModal,
              private sessionService: SessionService,
              public languageService: LanguageService,
              interactiveHelpService: InteractiveHelpService,
              modelPageHelpService: ModelPageHelpService,
              private authorizationManagerService: AuthorizationManagerService) {

    this.localizerProvider = () => languageService.createLocalizer(this.model);
    this._show = sessionService.show;

    this.initialRoute = $route.current!;
    this.currentRouteParams = this.initialRoute.params;

    this.init(new RouteData(this.currentRouteParams));

    $scope.$on('$locationChangeSuccess', () => {
      if ($location.path().startsWith('/model')) {
        this.init(new RouteData($route.current!.params));

        // FIXME: hack to prevent reload on params update
        // https://github.com/angular/angular.js/issues/1699#issuecomment-45048054
        // TODO: consider migration to angular-ui-router if it fixes the problem elegantly (https://ui-router.github.io/ng1/)
        this.currentRouteParams = $route.current!.params;
        $route.current = this.initialRoute;
      }
    });

    $scope.$on('$locationChangeStart', (event, next, current) => {
      if (interactiveHelpService.isClosed() && isDifferentUrl(current, next)) {
        this.ifEditing(() => event.preventDefault(), () => $location.url(nextUrl($location, next)));
      }
    });

    $scope.$watch(() => this.model, (newModel: Model, oldModel: Model) => {
      if (oldModel && !newModel) { // model removed
        $location.url('/');
      }

      this.helps = modelPageHelpService.getHelps(newModel);
    });

    $scope.$watch(() => this.selection, (selection, oldSelection) => {

      this.alignTabWithSelection();

      if (!matchesIdentity(selection, oldSelection)) {
        if (oldSelection) {
          this.openPropertyId = undefined;
        }
        this.updateLocation();
      }

      if (!selection) {
        this._show = Show.Visualization;
      } else if (!oldSelection) {
        this._show = this.sessionService.show !== Show.Visualization ? this.sessionService.show : Show.Both;
      }
    });

    $scope.$watch(() => this.model && this.languageService.getModelLanguage(this.model), () => {
      if (this.model) {
        this.sortAll();
      }
    });

    $scope.$watch(() => this.show, show => {
      for (const changeListener of this.changeListeners) {
        changeListener.onResize(show);
      }
    });

    $scope.$watch(() => this.selectionWidth, () => {
      for (const changeListener of this.changeListeners) {
        changeListener.onResize(this.show);
      }
    });

    $scope.$watch(() => $route.current!.params.property, propertyId => this.openPropertyId = propertyId);
    $scope.$watch(() => this.openPropertyId, propertyId => {
      if (this.currentRouteParams.property !== propertyId) {
        this.updateLocation();
      }
    });
  }

  private init(routeData: RouteData) {

    const modelChanged = !this.model || this.model.prefix !== routeData.existingModelPrefix;
    const selectionChanged = !areEqual((this.selection && this.selection.id.curie), routeData.resourceCurie);

    this.openPropertyId = routeData.propertyId;

    const modelNotFoundHandler = () => {
      this.notificationModal.openModelNotFound();
      return this.$q.reject('model not found');
    };

    const resourceNotFoundHandler = () => this.notificationModal.openResourceNotFound(this.model);

    if (modelChanged) {
      this.loading = true;

      this.updateModelByPrefix(routeData.existingModelPrefix)
        .then(() => true, modelNotFoundHandler)
        .then(() => this.$q.all([this.selectRouteOrDefault(routeData).then(() => true, resourceNotFoundHandler), this.updateSelectables()]))
        .then(() => this.updateLocation())
        .then(() => this.loading = false)
        .catch(err => {
          // TODO handle with error modal
          console.log(err);
          throw err;
        });

    } else if (selectionChanged) {
      this.selectRouteOrDefault(routeData).then(() => true, resourceNotFoundHandler)
        .then(() => this.updateLocation())
        .catch(err => {
          // TODO handle with error modal
          console.log(err);
          throw err;
        });
    }
  }

  private updateLocation() {

    if (this.model) {
      this.locationService.atModel(this.model, this.selection);

      const newParams: any = { prefix: this.model.prefix };

      if (this.selection) {
        newParams.resource = this.selection.id.namespace === this.model.namespace
          ? this.selection.id.name
          : this.selection.id.curie;
      } else {
        newParams.resource = undefined;
      }

      newParams.property = this.openPropertyId;

      if (!areEqual(newParams.prefix, this.currentRouteParams.prefix)
        || !areEqual(newParams.resource, this.currentRouteParams.resource)
        || !areEqual(newParams.property, this.currentRouteParams.property)) {

        this.$route.updateParams(newParams);
      }
    }
  }

  get visualizationWidth() {
    return this.show !== 2 ? `calc(100% - ${this.selectionWidth}px)` : '100%';
  }

  get show() {
    return isDefined(this._show) ? this._show : Show.Both;
  }

  set show(value: Show) {
    this._show = value;
    this.sessionService.show = value;
  }

  addListener(listener: ChangeListener<Class|Predicate>) {
    this.changeListeners.push(listener);
  }

  sortAll() {
    this.sortClasses();
    this.sortPredicates();
  }

  sortClasses() {
    this.classes.sort(this.selectableItemComparator);
    setOverlaps(this.classes);
  }

  sortPredicates() {
    this.associations.sort(this.selectableItemComparator);
    this.attributes.sort(this.selectableItemComparator);
    setOverlaps(this.associations);
    setOverlaps(this.attributes);
  }

  get selectableItemComparator() {
    return comparingLocalizable<SelectableItem>(this.localizerProvider(), selectableItem => selectableItem.item.label);
  }

  getUsedNamespaces(): Set<string> {

    const resources: WithDefinedBy[] = [
      ...this.associations,
      ...this.attributes,
      ...this.classes
    ];

    const namespaces = resources
      .filter(item => item && item.definedBy)
      .map(item => item.definedBy!.id.uri);

    return new Set<string>(namespaces);
  }

  registerView(view: View) {
    this.views.push(view);
  }

  isSelected(selection: SelectableItem) {
    return selection.matchesIdentity(this.selectedItem);
  }

  isLoading(listItem: SelectableItem) {
    return matchesIdentity(listItem, this.selectedItem) && !matchesIdentity(listItem, this.selection);
  }

  select(item: WithIdAndType) {
    this.askPermissionWhenEditing(() => {
      this.selectByTypeAndId(item);
    });
  }

  selectionEdited(oldSelection: Class|Predicate|null, newSelection: Class|Predicate) {
    this.selectedItem = newSelection;
    this.updateSelectables();

    for (const changeListener of this.changeListeners) {
      changeListener.onEdit(newSelection, oldSelection);
    }
  }

  canEdit(): boolean {
    return this.model && this.authorizationManagerService.canEditModel(this.model);
  }

  selectionDeleted(selection: Class|Predicate) {

    removeMatching(this.classes, item => matchesIdentity(item, selection));
    removeMatching(this.attributes, item => matchesIdentity(item, selection));
    removeMatching(this.associations, item => matchesIdentity(item, selection));

    for (const changeListener of this.changeListeners) {
      changeListener.onDelete(selection);
    }
  }

  public addEntity(type: ClassType|KnownPredicateType) {
    if (type === 'class' || type === 'shape') {
      if (this.model.isOfType('profile')) {
        // profiles can create multiple shapes of single class so exists exclusion is not wanted
        // profiles can create copy of shapes so type exclusion is not wanted
        return this.addClass(createDefinedByExclusion(this.model));
      } else {
        return this.addClass(combineExclusions<AbstractClass>(
          createClassTypeExclusion(SearchClassType.Class),
          createDefinedByExclusion(this.model),
          createExistsExclusion(collectIds(this.classes)))
        );
      }
    } else {
      this.addPredicate(type, combineExclusions<AbstractPredicate>(
        createExistsExclusion(collectIds([this.attributes, this.associations])),
        createDefinedByExclusion(this.model))
      );
    }
  }

  private addClass(exclusion: Exclusion<AbstractClass>) {

    const isProfile = this.model.isOfType('profile');
    const textForSelection = (klass: Optional<Class>) => {
      if (isProfile) {
        if (klass && klass.isOfType('shape')) {
          return 'Copy shape';
        } else {
          return 'Specialize class';
        }
      } else {
        return 'Use class';
      }
    };

    this.createOrAssignEntity(
      () => this.searchClassModal.open(this.model, exclusion, textForSelection),
      (external: ExternalEntity) => {
        if (isProfile) {
          this.createShape(external, true);
        } else {
          this.$q.reject('Library does not support external');
        }
      },
      (concept: EntityCreation) => this.createClass(concept),
      (klass: Class) => {
        if (klass.unsaved) {
          this.selectNewlyCreatedOrAssignedEntity(klass);
        } else if (klass.isOfType('shape')) {
          this.copyShape(klass);
        } else if (isProfile) {
          this.createShape(klass, klass.external);
        } else {
          this.assignClassToModel(klass).then(() => klass);
        }
      }
    );
  }

  private addPredicate(type: KnownPredicateType, exclusion: Exclusion<AbstractPredicate>) {
    this.createOrAssignEntity(
      () => this.searchPredicateModal.openAddPredicate(this.model, type, exclusion),
      (_external: ExternalEntity) => this.$q.reject('Unsupported operation'),
      (concept: EntityCreation) => this.createPredicate(concept, type),
      (predicate: Predicate) => this.assignPredicateToModel(predicate)
    );
  }

  private createOrAssignEntity<T extends Class|Predicate>(modal: () => IPromise<ExternalEntity|EntityCreation|T>,
                                                          fromExternalEntity: (external: ExternalEntity) => void,
                                                          fromConcept: (concept: EntityCreation) => void,
                                                          fromEntity: (entity: T) => void) {

    this.askPermissionWhenEditing(() => {
      modal().then(result => {
        if (result instanceof EntityCreation) {
          fromConcept(result);
        } else if (result instanceof ExternalEntity) {
          fromExternalEntity(result);
        } else {
          fromEntity(<T> result);
        }
      }, modalCancelHandler);
    });
  }

  selectNewlyCreatedOrAssignedEntity<T extends Class|Predicate>(entity: T) {

    this.updateSelection(entity);

    if (!entity.unsaved) {
      this.updateSelectables();

      for (const changeListener of this.changeListeners) {
        changeListener.onAssign(entity);
      }
    }
  }

  createClass(conceptCreation: EntityCreation) {
    this.classService.newClass(this.model, conceptCreation.entity.label, conceptCreation.conceptId, this.languageService.getModelLanguage(this.model))
      .then(klass => this.selectNewlyCreatedOrAssignedEntity(klass));
  }

  createShape(classOrExternal: Class|ExternalEntity, external: boolean) {

    this.classService.newShape(classOrExternal, this.model, external, this.languageService.getModelLanguage(this.model))
      .then(shape => {
        if (shape.properties.length > 0) {
          return this.$q.all([this.$q.when(shape), this.addPropertiesFromClassModal.open(shape, external ? 'external class' : 'scope class', this.model)]);
        } else {
          return this.$q.when([shape, shape.properties]);
        }
      })
      .then(([shape, properties]: [Class, Property[]]) => {
        shape.properties = properties;
        this.selectNewlyCreatedOrAssignedEntity(shape);
      });
  }

  copyShape(shape: Class) {

    if (!this.model.isOfType('profile')) {
      throw new Error('Shapes can be copied only to profile');
    }

    const copiedShape = shape.copy(this.model);
    this.selectNewlyCreatedOrAssignedEntity(copiedShape);
  }

  assignClassToModel(klass: Class) {
    return this.classService.assignClassToModel(klass.id, this.model)
      .then(() => this.selectNewlyCreatedOrAssignedEntity(klass));
  }

  createPredicate(conceptCreation: EntityCreation, type: KnownPredicateType) {
    return this.predicateService.newPredicate(this.model, conceptCreation.entity.label, conceptCreation.conceptId, type, this.languageService.getModelLanguage(this.model))
      .then(predicate => this.selectNewlyCreatedOrAssignedEntity(predicate));
  }

  assignPredicateToModel(predicate: Predicate) {
    return this.predicateService.assignPredicateToModel(predicate.id, this.model)
      .then(() => this.selectNewlyCreatedOrAssignedEntity(predicate));
  }

  private findEditingViews() {
    return this.views.filter(view => view.isEditing());
  }

  private confirmThenCancelEditing(editingViews: View[], callback: () => void) {
    this.confirmationModal.openEditInProgress().then(() => {
      editingViews.forEach(view => view.cancelEditing());
      callback();
    }, modalCancelHandler);
  }

  private ifEditing(synchronousCallback: () => void, confirmedCallback: () => void) {
    const editingViews = this.findEditingViews();

    if (editingViews.length > 0) {
      synchronousCallback();
      this.confirmThenCancelEditing(editingViews, confirmedCallback);
    }
  }

  private askPermissionWhenEditing(callback: () => void) {
    const editingViews = this.findEditingViews();

    if (editingViews.length > 0) {
      this.confirmThenCancelEditing(editingViews, callback);
    } else {
      callback();
    }
  }

  private selectRouteOrDefault(routeData: RouteData): IPromise<any> {

    const that = this;

    function rootClassSelection(): WithIdAndType|null {
      return that.model.rootClass ? { id: that.model.rootClass, selectionType: 'class' } : null;
    }

    function getRouteSelection(): IPromise<WithIdAndType|null> {

      if (routeData.resourceCurie) {
        const resourceUri = new Uri(routeData.resourceCurie, that.model.context);
        const startsWithCapital = /^([A-Z]).*/.test(resourceUri.name);
        const selectionType: SelectionType = startsWithCapital ? 'class' : 'predicate';

        if (resourceUri.resolves()) {
          return that.$q.resolve({
            id: resourceUri,
            selectionType
          });
        } else {
          const prefix = routeData.resourceCurie.split(':')[0];
          return that.modelService.getModelByPrefix(prefix).then(model => {
            return {
              id: new Uri(routeData.resourceCurie, model.context),
              selectionType
            };
          });
        }
      } else {
        return that.$q.when(null);
      }
    }

    return getRouteSelection()
      .then(selectionFromRoute => {
        const selection = selectionFromRoute || rootClassSelection();
        return this.selectByTypeAndId(selection);
      });
  }

  // TODO remove retrying when data is coherent
  private selectByTypeAndId(selection: WithIdAndType|null, isRetry: boolean = false): IPromise<any> {

    // set selected item also here for showing selection before entity actually is loaded
    this.selectedItem = selection;
    const selectionChanged = !matchesIdentity(this.selection, selection);

    if (selection) {
      if (selectionChanged) {
        return this.fetchEntityByTypeAndId(selection)
          .then(entity => {
            if (!entity && !isRetry) {
              return this.selectByTypeAndId({
                id: selection.id,
                selectionType: selection.selectionType === 'class' ? 'predicate' : 'class'
              }, true);
            } else {
              if (!entity) {
                return this.$q.reject('resource not found');
              } else {
                return this.updateSelection(entity);
              }
            }
          });
      } else {
        return this.$q.resolve();
      }
    } else {
      return this.$q.when(this.updateSelection(null));
    }
  }

  private fetchEntityByTypeAndId(selection: WithIdAndType): IPromise<Class|Predicate> {
    if (!this.selection || !matchesIdentity(this.selection, selection)) {
      return selection.selectionType === 'class'
        ? this.classService.getClass(selection.id, this.model)
        : this.predicateService.getPredicate(selection.id, this.model);
    } else {
      return this.$q.when(this.selection);
    }
  }

  private alignTabWithSelection() {

    const tabType = this.selection instanceof Predicate ? this.selection.normalizedType : 'class';

    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].type === tabType) {
        this.activeTab = i;
        break;
      }
    }
  }

  private updateSelection(selection: Class|Predicate|null) {
    this.selectedItem = selection;
    this.selection = selection;
  }

  private updateModelByPrefix(prefix: string) {
    return this.modelService.getModelByPrefix(prefix)
      .then(model => this.model = model);
  }

  private updateSelectables(): IPromise<any> {
    return this.$q.all([this.updateClasses(), this.updatePredicates()]);
  }

  private updateClasses(): IPromise<any> {
    return this.classService.getClassesAssignedToModel(this.model)
      .then(classes => {
        this.classes = classes.map(klass => new SelectableItem(klass, this));
        this.sortClasses();
      });
  }

  private updatePredicates(): IPromise<any> {
    return this.predicateService.getPredicatesAssignedToModel(this.model)
      .then(predicates => {
        this.attributes = _.chain(predicates)
          .filter(predicate => predicate.isOfType('attribute'))
          .map(attribute => new SelectableItem(attribute, this))
          .value();

        this.associations = _.chain(predicates)
          .filter(predicate => predicate.isOfType('association'))
          .map(association => new SelectableItem(association, this))
          .value();
        this.sortPredicates();
      });
  }
}


class RouteData {

  existingModelPrefix: string;
  resourceCurie: string;
  propertyId: string;

  constructor(params: any) {
    this.existingModelPrefix = params.prefix;

    if (params.resource) {
      const split = params.resource.split(':');

      if (split.length === 1) {
        this.resourceCurie = params.prefix + ':' + params.resource;
      } else if (split.length === 2) {
        this.resourceCurie = params.resource;
      } else {
        throw new Error('Unsupported resource format: ' + params.resource);
      }

      if (params.property) {
        this.propertyId = params.property;
      }
    }
  }
}

class Tab {

  addLabel: string;
  glyphIconClass: any;
  addNew: () => void;

  constructor(public type: ClassType|KnownPredicateType, public items: () => SelectableItem[], modelController: ModelPageController) {
    this.addLabel = 'Add ' + type;
    this.glyphIconClass = glyphIconClassForType([type]);
    this.addNew = () => modelController.addEntity(type);
  }
}


interface WithIdAndType {
  id: Uri;
  selectionType: SelectionType;
}

function matchesIdentity(lhs: WithIdAndType|null|undefined, rhs: WithIdAndType|null|undefined) {
  return areEqual(lhs, rhs, (l, r) => l.selectionType === r.selectionType && l.id.equals(r.id));
}

function setOverlaps(items: SelectableItem[]) {
  let previous: SelectableItem|undefined;
  for (const item of items) {
    if (previous && previous.rawLabel === item.rawLabel) {
      previous.hasOverlap = true;
      item.hasOverlap = true;
    } else {
      item.hasOverlap = false;
    }
    previous = item;
  }
}

class SelectableItem implements WithDefinedBy {

  hasOverlap = false;

  constructor(public item: ClassListItem|PredicateListItem, private modelController: ModelPageController) {
  }

  get id(): Uri {
    return this.item.id;
  }

  get rawLabel(): string {
    return this.modelController.languageService.translate(this.item.label, this.modelController.model);
  }

  get label(): string {
    return this.rawLabel + (this.hasOverlap ? ` (${this.id.compact})` : '');
  }

  get definedBy() {
    return this.item.definedBy;
  }

  get selectionType() {
    return this.item.selectionType;
  }

  matchesIdentity(obj: WithIdAndType|null|undefined) {
    return matchesIdentity(this.item, obj);
  }
}
