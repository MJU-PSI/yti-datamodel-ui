import IHttpPromise = angular.IHttpPromise;
import IHttpService = angular.IHttpService;
import IPromise = angular.IPromise;
import IQService = angular.IQService;
import * as _ from 'lodash';
import {
  EntityDeserializer,
  Attribute,
  Association,
  Class,
  ClassListItem,
  Predicate,
  Property,
  Uri,
  Model
} from './entities';
import { PredicateService } from './predicateService';
import { Language } from './languageService';
import { upperCaseFirst } from 'change-case';
import { config } from '../config';

export class ClassService {

  /* @ngInject */
  constructor(private $http: IHttpService, private $q: IQService, private predicateService: PredicateService, private entities: EntityDeserializer) {
  }

  getClass(id: Uri): IPromise<Class> {
    return this.$http.get(config.apiEndpointWithName('class'), {params: {id}}).then(response => this.entities.deserializeClass(response.data));
  }

  getAllClasses(): IPromise<ClassListItem[]> {
    return this.$http.get(config.apiEndpointWithName('class')).then(response => this.entities.deserializeClassList(response.data));
  }

  getClassesForModel(modelId: Uri): IPromise<ClassListItem[]> {
    return this.$http.get(config.apiEndpointWithName('class'), {params: {model: modelId}}).then(response => this.entities.deserializeClassList(response.data));
  }

  createClass(klass: Class): IPromise<any> {
    const requestParams = {
      id: klass.id,
      model: klass.definedBy.id
    };
    return this.$http.put<{ identifier: Uri }>(config.apiEndpointWithName('class'), klass.serialize(), {params: requestParams})
      .then(response => {
        klass.unsaved = false;
        klass.version = response.data.identifier;
      });
  }

  updateClass(klass: Class, originalId: Uri): IPromise<any> {
    const requestParams: any = {
      id: klass.id,
      model: klass.definedBy.id
    };
    if (requestParams.id !== originalId) {
      requestParams.oldid = originalId;
    }
    return this.$http.post<{ identifier: Uri }>(config.apiEndpointWithName('class'), klass.serialize(), {params: requestParams})
      .then(response => {
        klass.version = response.data.identifier;
      })
  }

  deleteClass(id: Uri, modelId: Uri): IHttpPromise<any> {
    const requestParams = {
      id,
      model: modelId
    };
    return this.$http.delete(config.apiEndpointWithName('class'), {params: requestParams});
  }

  assignClassToModel(classId: Uri, modelId: Uri): IHttpPromise<any> {
    const requestParams = {
      id: classId,
      model: modelId
    };
    return this.$http.post(config.apiEndpointWithName('class'), undefined, {params: requestParams});
  }

  newClass(model: Model, classLabel: string, conceptID: Uri, lang: Language): IPromise<Class> {
    return this.$http.get(config.apiEndpointWithName('classCreator'), {params: {modelID: model.id, classLabel: upperCaseFirst(classLabel), conceptID, lang}})
      .then((response: any) => {
        _.extend(response.data['@context'], model.context);
        return this.entities.deserializeClass(response.data);
      })
      .then((klass: Class) => {
        klass.unsaved = true;
        return klass;
      });
  }

  newShape(classId: Uri, profile: Model, lang: Language): IPromise<Class> {
    return this.$http.get(config.apiEndpointWithName('shapeCreator'), {params: {profileID: profile.id, classID: classId, lang}})
      .then((response: any) => {
        _.extend(response.data['@context'], profile.context);
        return this.entities.deserializeClass(response.data);
      })
      .then((klass: Class) => {
        klass.unsaved = true;
        return klass;
      });
  }

  newProperty(predicateId: Uri): IPromise<Property> {
    return this.$q.all({
        predicate: this.predicateService.getPredicate(predicateId),
        property: this.$http.get(config.apiEndpointWithName('classProperty'), {params: {predicateID: predicateId}})
      })
      .then(result => {
        const predicate = result['predicate'];
        return this.$q.all({
          predicate,
          property: this.entities.deserializeProperty(predicate.expandContext(result['property'].data))
        })})
      .then(result => {
        const property: Property = result['property'];
        const predicate: Predicate = result['predicate'];

        if (!property.label) {
          property.label = predicate.label;
        }

        if (predicate instanceof Attribute && !property.dataType) {
          property.dataType = predicate.dataType || 'xsd:string';
        } else if (predicate instanceof Association && !property.valueClass) {
          property.valueClass = predicate.valueClass;
        }

        property.state = 'Unstable';

        return property;
      });
  }

  getVisualizationData(model: Model, classId: Uri) {
    return this.$http.get(config.apiEndpointWithName('classVisualizer'), {params: {classID: classId, modelID: model.id}})
      .then(response => this.entities.deserializeClassVisualization(model.expandContext(response.data)));
  }
}
