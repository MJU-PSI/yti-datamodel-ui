// import { IScope } from 'angular';
// import { Uri } from '../../entities/uri';
// import { PredicateService } from '../../services/predicateService';
// import { SearchPredicateModal } from './searchPredicateModal';
// import { createDefinedByExclusion } from '../../utils/exclusion';
// import { ClassFormComponent } from './classForm';
// import { anyMatching, requireDefined } from '@mju-psi/yti-common-ui';
// import { CopyPredicateModal } from './copyPredicateModal';
// import { Property } from '../../entities/class';
// import { Model } from '../../entities/model';
// import { Association, Attribute, Predicate } from '../../entities/predicate';
// import { LegacyComponent, modalCancelHandler } from '../../utils/angular';

// @LegacyComponent({
//   bindings: {
//     id: '=',
//     property: '=',
//     model: '='
//   },
//   require: {
//     classForm: '^classForm'
//   },
//   template: require('./propertyPredicateView.html')
// })
// export class PropertyPredicateViewComponent {

//   loading: boolean;
//   property: Property;
//   model: Model;
//   predicate: Predicate|null;
//   changeActions: { name: string, apply: () => void }[] = [];

//   classForm: ClassFormComponent;

//   constructor(private $scope: IScope,
//               private predicateService: PredicateService,
//               private searchPredicateModal: SearchPredicateModal,
//               private copyPredicateModal: CopyPredicateModal) {
//     'ngInject';
//   }

//   $onInit() {

//     const setResult = (p: Predicate|null) => {
//       this.predicate = p;
//       this.updateChangeActions().then(() => this.loading = false);
//     };

//     this.$scope.$watch(() => this.property && this.property.predicate, predicate => {
//       this.loading = true;

//       if (predicate instanceof Association || predicate instanceof Attribute) {
//         setResult(predicate);
//       } else if (predicate instanceof Uri) {
//         if (this.model.isNamespaceKnownToBeNotModel(predicate.namespace)) {
//           this.predicateService.getExternalPredicate(predicate, this.model).then(setResult, (_err: any) => setResult(null));
//         } else {
//           this.predicateService.getPredicate(predicate).then(setResult, (_err: any) => setResult(null));
//         }
//       } else {
//         throw new Error('Unsupported predicate: ' + predicate);
//       }
//     });
//   }

//   isEditing() {
//     return this.classForm && this.classForm.isEditing();
//   }

//   updateChangeActions() {

//     const predicate = this.predicate;
//     const predicateId = this.property.predicateId;

//     this.changeActions = [{name: 'Change reusable predicate', apply: () => this.changeReusablePredicate()}];

//     const assignAction = () => {
//       return {
//         name: `Assign reusable predicate to ${this.model.normalizedType}`,
//         apply: () => this.assignReusablePredicateToModel()
//       };
//     };

//     const copyAction = (type: 'attribute'|'association') => {
//       return {
//         name: `Copy reusable ${type} to ${this.model.normalizedType}`,
//         apply: () => this.copyReusablePredicateToModel(predicate || predicateId, type)
//       };
//     };

//     return this.predicateService.getPredicatesAssignedToModel(this.model).then(predicates => {

//       const isAssignedToModel = anyMatching(predicates, assignedPredicate => assignedPredicate.id.equals(predicateId));

//       if (!isAssignedToModel) {
//         if (predicate && (this.model.isOfType('profile') || predicate.definedBy.isOfType('library')) && this.model.isNamespaceKnownToBeModel(predicate.id.namespace)) {
//           this.changeActions.push(assignAction());
//         }

//         if (predicate && (predicate.isAssociation() || predicate.isAttribute())) {
//           this.changeActions.push(copyAction(predicate.normalizedType as 'attribute' | 'association'));
//         } else {
//           this.changeActions.push(copyAction('attribute'));
//           this.changeActions.push(copyAction('association'));
//         }
//       }
//     });
//   }

//   linkToId() {
//     return this.predicate && this.model.linkToResource(this.predicate.id);
//   }

//   changeReusablePredicate() {

//     if (this.property.normalizedPredicateType === 'property') {
//       throw new Error('Property must be of known type');
//     }

//     this.searchPredicateModal.openWithOnlySelection(this.model, requireDefined(this.property.normalizedPredicateType), createDefinedByExclusion(this.model)).then(predicate => {
//       this.property.predicate = predicate.id; // Could be full predicate instead of id but this is consistent with api data
//     }, modalCancelHandler);
//   }

//   assignReusablePredicateToModel() {
//     this.predicateService.assignPredicateToModel(this.property.predicateId, this.model)
//       .then(() => this.updateChangeActions());
//   }

//   copyReusablePredicateToModel(predicateToBeCopied: Predicate|Uri, type: 'attribute'|'association') {
//     this.copyPredicateModal.open(predicateToBeCopied, type, this.model)
//       .then(copied => this.predicateService.createPredicate(copied).then(() => copied))
//       .then(predicate => this.property.predicate = predicate.id, modalCancelHandler);
//   }
// }


import { Component  } from '@angular/core';


@Component({
  selector: 'property-predicate-view',
  template: ''
})
export class PropertyPredicateViewComponent  {

}
