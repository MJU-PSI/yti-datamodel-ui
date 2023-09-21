import { isDefined } from '@mju-psi/yti-common-ui';
import { UsageService } from 'app/services/usageService';
import { ErrorModal } from 'app/components/form/errorModal';
import { PredicateService } from 'app/services/predicateService';
import { glyphIconClassForType } from 'app/utils/entity';
import { EditableForm } from 'app/components/form/editableEntityController';
import { PredicateViewComponent } from './predicateView';
import { Model } from 'app/entities/model';
import { Association, Attribute } from 'app/entities/predicate';
import { KnownPredicateType } from 'app/types/entity';
import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';
import { SessionService } from 'app/services/sessionService';
import { LanguageService } from 'app/services/languageService';
import { SearchPredicateModal } from './searchPredicateModal';
import { Property } from 'app/entities/class';
import { Option } from 'app/components/common/buttonWithOptions';
import { comparingLocalizable } from 'app/utils/comparator';
import { IScope } from 'angular';
import { SearchClassModal } from './searchClassModal';

@LegacyComponent({
  bindings: {
    id: '@',
    predicate: '=',
    oldPredicate: '=',
    model: '=',
    openPropertyId: '='
  },
  require: {
    predicateView: '?^predicateView',
    form: '?^form'
  },
  template: require('./predicateForm.html')
})
export class PredicateFormComponent {

  model: Model;
  predicate: Attribute|Association;
  oldPredicate: Attribute|Association;
  annotations: Property[];
  addAnnotationActions: Option[];
  openPropertyId: string;

  predicateView: PredicateViewComponent;
  form: EditableForm;

  constructor(private predicateService: PredicateService,
              private usageService: UsageService,
              private sessionService: SessionService,
              private languageService: LanguageService,
              private searchPredicateModal: SearchPredicateModal,
              private searchClassModal: SearchClassModal,
              private $scope: IScope,
              private errorModal: ErrorModal) {
    'ngInject';
  }

  $onInit() {

    const setProperties = () => {
      if (this.isEditing() || !this.sortAlphabetically) {
        this.annotations = this.predicate.annotations;
      } else {
        this.annotations = this.predicate.annotations.slice();
        this.annotations.sort(comparingLocalizable<Property>(this.languageService.createLocalizer(this.model), property => property.label));
      }
    };

    this.$scope.$watchGroup([
        () => this.predicate,
        () => this.predicate.annotations,
        () => this.languageService.getModelLanguage(this.model),
        () => this.sortAlphabetically,
        () => this.isEditing()
      ],
      () => setProperties());

    this.addAnnotationActions = [
      {
        name: 'Add annotation',
        apply: () => this.addAnnotation()
      }
    ];
  }

  get sortAlphabetically() {
    return this.sessionService.sortAlphabetically || false;
  }

  set sortAlphabetically(value: boolean) {
    this.sessionService.sortAlphabetically = value;
  }

  addAnnotation() {
    this.searchPredicateModal.openAddAnnotation(this.model, this.predicate.annotations)
      .then(property => {
        this.predicate.addAnnotation(property);
        this.openPropertyId = property.internalId.uuid;
      }, modalCancelHandler);
  }

  isEditing() {
    return this.form && this.form.editing;
  }

  get shouldAutofocus() {
    return !isDefined(this.predicateView);
  }

  linkToIdProperty() {
    return this.model.linkToResource(this.predicate.id);
  }

  linkToSuperProperty() {
    return this.model.linkToResource(this.predicate.subPropertyOf);
  }

  linkToValueClass() {
    const predicate = this.predicate;
    if (predicate instanceof Association) {
      return this.model.linkToResource(predicate.valueClass);
    } else {
      return '';
    }
  }

  get changedType(): KnownPredicateType {
    return this.predicate instanceof Attribute ? 'association' : 'attribute';
  }

  get changeTypeIconClass() {
    return glyphIconClassForType([this.changedType]);
  }

  changeType() {
    this.usageService.getUsage(this.predicate).then(usage => {
      if (usage.referrers.length > 0) {
        this.errorModal.openUsageError('Predicate in use', 'Predicate type cannot be changed because it is already used by following resources', usage, this.model);
      } else {
        this.predicateService.changePredicateType(this.predicate, this.changedType, this.model)
          .then(changedPredicate => this.predicate = changedPredicate);
      }
    });
  }
}
