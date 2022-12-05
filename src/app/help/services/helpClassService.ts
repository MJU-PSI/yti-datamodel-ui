import { flatten, requireDefined } from '@goraresult/yti-common-ui';
import { IPromise, IQService } from 'angular';
import * as moment from 'moment';
import { DataSource } from '../../components/form/dataSource';
import { Class, Property } from '../../entities/class';
import { ExternalEntity } from '../../entities/externalEntity';
import { Model } from '../../entities/model';
import { Predicate } from '../../entities/predicate';
import { Uri, Urn } from '../../entities/uri';
import { Concept } from '../../entities/vocabulary';
import { ClassService, RelatedClass } from '../../services/classService';
import { VocabularyService } from '../../services/vocabularyService';
import { KnownPredicateType } from '../../types/entity';
import { Language } from '../../types/language';
import { EntityCreatorService } from './entityCreatorService';
import { ResetableService } from './resetableService';
import { ModelResourceStore } from './resourceStore';

export class InteractiveHelpClassService implements ClassService, ResetableService {

  private store = new ModelResourceStore<Class>(this.$q);

  constructor(private $q: IQService,
              private entityCreatorService: EntityCreatorService,
              private helpVocabularyService: VocabularyService) {
    'ngInject';
  }

  reset(): IPromise<any> {
    this.store.clear();
    return this.$q.when();
  }

  getClass(id: Uri|Urn, model: Model): IPromise<Class> {
    return this.$q.when(this.store.getResourceForAnyModelById(id));
  }

  getAllClasses(model: Model): IPromise<Class[]> {
    return this.$q.when(this.store.getResourceValuesForAllModels());
  }

  getRequiredByClasses(model: Model): IPromise<Class[]> {
    throw new Error('getRequiredByClasses is not yet implemented in help');
  }

  getClassesForModel(model: Model): IPromise<Class[]> {
    return this.store.getAllResourceValuesForModel(model);
  }

  getClassesForModelDataSource(modelProvider: () => Model): DataSource<Class> {
    return (_search: string) => this.getClassesForModel(modelProvider());
  }

  getClassesAssignedToModel(model: Model): IPromise<Class[]> {
    return this.store.getAllResourceValuesForModel(model);
  }

  createClass(klass: Class): IPromise<any> {
    klass.unsaved = false;
    klass.createdAt = moment();
    this.store.addResourceToModel(klass.definedBy, klass);
    return this.$q.when();
  }

  updateClass(klass: Class, originalId: Uri, model: Model): IPromise<any> {
    klass.modifiedAt = moment();
    this.store.updateResourceInModel(klass.definedBy, klass, originalId.uri);
    return this.$q.when();
  }

  deleteClass(id: Uri, model: Model): IPromise<any> {
    this.store.deleteResourceFromModel(model, id.uri);
    return this.$q.when();
  }

  assignClassToModel(classId: Uri, model: Model): IPromise<any> {
    this.store.assignResourceToModel(model, classId.uri);
    return this.$q.when();
  }

  newClass(model: Model, classLabel: string, conceptID: Uri|null, lang: Language): IPromise<Class> {

    const conceptPromise: IPromise<Concept|null> = conceptID ? this.helpVocabularyService.getConcept(conceptID) : this.$q.when(null);

    return conceptPromise
      .then(concept => {
        return this.entityCreatorService.createClass({
          model: model,
          lang: lang,
          label: classLabel,
          concept: concept ? concept : undefined
        }).then(klass => {
          klass.unsaved = true;
          return klass;
        });
      });
  }

  newRelatedClass(model: Model, relatedClass: RelatedClass): IPromise<Class> {
    throw new Error('newRelatedClass is not yet implemented in help');
  }

  newShape(classOrExternal: Class|ExternalEntity, profile: Model, external: boolean, lang: Language): IPromise<Class> {

    const id = requireDefined(classOrExternal.id);
    const classPromise = (classOrExternal instanceof ExternalEntity) ? this.getExternalClass(id, profile).then(requireDefined) : this.$q.when(classOrExternal);

    return classPromise
      .then(klass => this.entityCreatorService.createShape(klass, profile));
  }

  newClassFromExternal(externalId: Uri, model: Model): IPromise<Class> {
    throw new Error('newClassFromExternal is not yet supported in help');
  }

  getExternalClass(externalId: Uri, _model: Model): IPromise<Class|null> {
    return this.$q.when(this.store.findExternalResource(externalId));
  }

  getExternalClassesForModel(model: Model): IPromise<Class[]> {
    const externalNamespaces = model.importedNamespaces.filter(ns => ns.external);
    const externalResources = flatten(externalNamespaces.map(ns => this.store.getExternalResourcesForNamespace(ns.url)));
    return this.$q.when(externalResources);
  }

  newProperty(predicateOrExternal: Predicate|ExternalEntity, type: KnownPredicateType, model: Model): IPromise<Property> {
    if (predicateOrExternal instanceof ExternalEntity) {
      throw new Error('new property from external is not yet supported in help');
    } else {
      return this.entityCreatorService.createProperty({
        predicate: predicateOrExternal,
        type: type
      }).then(newProperty => {
        newProperty.status = 'DRAFT';
        return newProperty;
      });
    }
  }

  getInternalOrExternalClass(id: Uri, _model: Model): IPromise<Class|null> {
    return this.$q.when(this.store.getInternalOrExternalResource(id));
  }

  classExists(id: Uri) {
    return this.store.resourceExistsInAnyModel(id.toString());
  }

  clearCachedClasses(modelId: string): void {}
}
