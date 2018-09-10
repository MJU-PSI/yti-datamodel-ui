import { isDefined } from 'yti-common-ui/utils/object';
import { UsageService } from 'app/services/usageService';
import { ErrorModal } from 'app/components/form/errorModal';
import { PredicateService } from 'app/services/predicateService';
import { glyphIconClassForType } from 'app/utils/entity';
import { EditableForm } from 'app/components/form/editableEntityController';
import { PredicateViewController } from './predicateView';
import { Model } from 'app/entities/model';
import { Association, Attribute } from 'app/entities/predicate';
import { KnownPredicateType } from 'app/types/entity';
import { ComponentDeclaration } from 'app/utils/angular';
import { forwardRef } from '@angular/core';

export const PredicateFormComponent: ComponentDeclaration = {
  selector: 'predicateForm',
  bindings: {
    id: '=',
    predicate: '=',
    oldPredicate: '=',
    model: '='
  },
  require: {
    predicateView: '?^predicateView',
    form: '?^form'
  },
  template: require('./predicateForm.html'),
  controller: forwardRef(() => PredicateFormController)
};

class PredicateFormController {

  model: Model;
  predicate: Attribute|Association;
  oldPredicate: Attribute|Association;

  predicateView: PredicateViewController;
  form: EditableForm;

  /* @ngInject */
  constructor(private predicateService: PredicateService,
              private usageService: UsageService,
              private errorModal: ErrorModal) {
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
