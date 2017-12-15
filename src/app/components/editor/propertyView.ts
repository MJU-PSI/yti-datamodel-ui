import { IAttributes, IScope } from 'angular';
import { ClassFormController } from './classForm';
import { Uri } from '../../entities/uri';
import { LanguageService } from '../../services/languageService';
import { anyMatching, allMatching } from 'yti-common-ui/utils/array';
import { module as mod } from './module';
import { hasLocalization } from '../../utils/language';
import { Property, Class } from '../../entities/class';
import { Model } from '../../entities/model';
import { Predicate } from '../../entities/predicate';

mod.directive('propertyView', () => {
  return {
    scope: {
      property: '=',
      class: '=',
      model: '='
    },
    restrict: 'E',
    template: require('./propertyView.html'),
    controllerAs: 'ctrl',
    bindToController: true,
    require: ['propertyView', '^classForm'],
    link($scope: IScope, element: JQuery, _attributes: IAttributes,
         [thisController, classFormController]: [PropertyViewController, ClassFormController]) {

      thisController.isOpen = () => classFormController.openPropertyId === thisController.property.internalId.uuid;
      thisController.isEditing = () => classFormController.isEditing();

      function scrollTo(previousTop?: number) {
        const scrollTop = element.offset().top;

        if (!previousTop || scrollTop !== previousTop) {
          // wait for stabilization
          setTimeout(() => scrollTo(scrollTop), 100);
        } else {
          jQuery('html, body').animate({scrollTop: scrollTop - 105}, 500);
        }
      }

      if (thisController.isOpen()) {
        scrollTo();
      }

      $scope.$watchCollection(() => thisController.class && thisController.class.properties, (oldProperties) => {

        const isPropertyAdded = allMatching(oldProperties, p => thisController.property.internalId.notEquals(p.internalId));

        if (thisController.isOpen() && isPropertyAdded) {
          scrollTo();
        }
      });
    },
    controller: PropertyViewController
  };
});

export class PropertyViewController {

  property: Property;
  class: Class;
  model: Model;
  isEditing: () => boolean;
  isOpen: () => boolean;

  valueClassExclude = (valueClass: Uri) =>
    anyMatching(this.class.properties, p => p !== this.property && this.property.predicateId.equals(p.predicateId) && valueClass.equals(p.valueClass))
      ? 'Duplicate association target' : null;

  /* @ngInject */
  constructor(private languageService: LanguageService) {
  }

  private get otherProperties() {
    return this.class.properties.filter(property => property.internalId.notEquals(this.property.internalId));
  }

  get otherPropertyLabels() {
    return this.otherProperties.map(property => property.label);
  }

  get otherPropertyIdentifiers() {
    return this.otherProperties.map(property => property.externalId);
  }

  get otherPropertyResourceIdentifiers() {
    return this.otherProperties.map(property => property.resourceIdentifier);
  }

  stemDatasource(_search: string) {
    return [
      new Uri('http://', {}),
      new Uri('https://', {}),
      new Uri('data:', {}),
      new Uri('mailto:', {}),
      new Uri('tel:', {}),
      new Uri('urn:', {})
    ];
  }

  get showAdditionalInformation() {
    return hasLocalization(this.property.editorialNote);
  }

  removeProperty(property: Property) {
    this.class.removeProperty(property);
  }

  linkToValueClass() {
    return this.model.linkToResource(this.property.valueClass);
  }

  get predicateName() {
    const predicate = this.property.predicate;
    if (predicate instanceof Predicate) {
      return this.languageService.translate(predicate.label, this.model);
    } else if (predicate instanceof Uri) {
      return predicate.compact;
    } else {
      throw new Error('Unsupported predicate: ' + predicate);
    }
  }
}
