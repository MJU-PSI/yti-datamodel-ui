import { assertNever, requireDefined, Status } from '@mju-psi/yti-common-ui';
import { IHttpService, IPromise, IQService } from 'angular';
import { upperCaseFirst } from 'change-case';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import * as frames from '../entities/frames';
import { ImportedNamespace, Link, Model, ModelListItem } from '../entities/model';
import { Uri, Urn } from '../entities/uri';
import { GraphData, KnownModelType } from '../types/entity';
import { Language } from '../types/language';
import { ClassService, DefaultClassService } from './classService';
import { apiEndpointWithName } from './config';
import { FrameService } from './frameService';
import { PredicateService } from './predicateService';

// export interface ModelService {

//   contentExpired$: BehaviorSubject<string | undefined>;

//   getModels(): IPromise<ModelListItem[]>;

//   getModelByUrn(urn: Uri | Urn): IPromise<Model>;

//   getModelByPrefix(prefix: string): IPromise<Model>;

//   createModel(model: Model): IPromise<any>;

//   updateModel(model: Model): IPromise<any>;

//   deleteModel(id: Uri): IPromise<any>;

//   newModel(prefix: string, label: string, classifications: string[], organizations: string[], lang: Language[], type: KnownModelType, redirect?: Uri): IPromise<Model>;

//   newModelRequirement(model: Model, resourceUri: string): IPromise<any>;

//   newLink(title: string, description: string, homepage: Uri, lang: Language): IPromise<Link>;

//   getAllImportableNamespaces(): IPromise<ImportedNamespace[]>;

//   newNamespaceImport(namespace: string, prefix: string, label: string, lang: Language | string): IPromise<ImportedNamespace>;

//   changeStatuses(model: Model, initialStatus: Status, endStatus: Status): IPromise<any>;

//   getModelResourcesTotalCountByStatus(model: Model, resourceStatus: Status): IPromise<number>;

//   createNewModelVersion(newPrefix: string, uri: string): IPromise<any>
// }

// export class DefaultModelService implements ModelService {

//   contentExpired$: BehaviorSubject<string | undefined> = new BehaviorSubject(undefined);

//   constructor(private $http: IHttpService,
//               private $q: IQService,
//               private frameService: FrameService,
//               private defaultClassService: ClassService,
//               private defaultPredicateService: PredicateService) {
//     'ngInject';
//   }

//   getModels(): IPromise<ModelListItem[]> {
//     return this.$http.get<GraphData>(apiEndpointWithName('model'))
//       .then(response => this.deserializeModelList(response.data!));
//   }

//   getModelByUrn(urn: Uri | Urn): IPromise<Model> {
//     return this.$http.get<GraphData>(apiEndpointWithName('model'), { params: { id: urn.toString() } })
//       .then(response => this.deserializeModelById(response.data!, urn));
//   }

//   getModelByPrefix(prefix: string): IPromise<Model> {
//     return this.$http.get<GraphData>(apiEndpointWithName('model'), { params: { prefix } })
//       .then(response => this.deserializeModelByPrefix(response.data!, prefix));
//   }

//   createModel(model: Model): IPromise<any> {
//     return this.$http.put<{ identifier: Urn }>(apiEndpointWithName('model'), model.serialize())
//       .then(response => {
//         model.unsaved = false;
//         model.version = response.data!.identifier;
//         model.createdAt = moment().utc();
//         model.modifiedAt = moment().utc();
//       });
//   }

//   updateModel(model: Model): IPromise<any> {
//     return this.$http.post<{ identifier: Urn }>(apiEndpointWithName('model'), model.serialize(), { params: { id: model.id.uri } })
//       .then(response => {
//         model.version = response.data!.identifier;
//         model.modifiedAt = moment().utc();
//       });
//   }

//   deleteModel(id: Uri): IPromise<any> {
//     const modelId: string = id.uri;
//     this.defaultClassService.clearCachedClasses(modelId);
//     this.defaultPredicateService.clearCachedPredicates(modelId);
//     return this.$http.delete(apiEndpointWithName('model'), { params: { id: modelId } });
//   }

//   newModel(prefix: string, label: string, classifications: string[], organizations: string[], lang: Language[], type: KnownModelType, redirect?: Uri): IPromise<Model> {

//     function mapEndpoint() {
//       switch (type) {
//         case 'library':
//           return 'modelCreator';
//         case 'profile':
//           return 'profileCreator';
//         default:
//           return assertNever(type, 'Unknown type: ' + type);
//       }
//     }

//     return this.$http.get<GraphData>(apiEndpointWithName(mapEndpoint()), {
//       params: {
//         prefix,
//         label: upperCaseFirst(label),
//         lang: lang[0],
//         langList: lang.join(' '),
//         redirect: redirect && redirect.uri,
//         serviceList: classifications.join(' '),
//         orgList: organizations.join(' ')
//       }
//     })
//       .then(response => this.deserializeModel(response.data!))
//       .then((model: Model) => {
//         model.unsaved = true;
//         return model;
//       });
//   }

//   newModelRequirement(model: Model, resourceUri: string): IPromise<any> {
//     return this.$http.put<{ identifier: Urn }>(apiEndpointWithName('newModelRequirement'), model.serialize(), { params: { model: model.id.uri, resource: resourceUri} })
//       .then(response => {
//         // TODO: Handling of the returned model
//       });
//   }

//   newLink(title: string, description: string, homepage: Uri, lang: Language) {
//     const graph = {
//       title: {
//         [lang]: title
//       },
//       description: {
//         [lang]: description
//       },
//       homepage: homepage.url
//     };

//     const frameObject = frames.modelFrame({ '@graph': graph, '@context': {} });

//     return this.$q.when(new Link(graph, {}, frameObject));
//   }

//   getAllImportableNamespaces(): IPromise<ImportedNamespace[]> {
//     return this.$http.get<GraphData>(apiEndpointWithName('listNamespaces'))
//       .then(response => this.deserializeImportedNamespaces(response.data!));
//   }

//   newNamespaceImport(namespace: string, prefix: string, label: string, lang: Language): IPromise<ImportedNamespace> {
//     return this.$http.get<GraphData>(apiEndpointWithName('modelRequirementCreator'), { params: { namespace, prefix, label, lang } })
//       .then(response => this.deserializeImportedNamespace(response.data!));
//   }

//   changeStatuses(model: Model, initialStatus: Status, endStatus: Status): IPromise<any> {

//     return this.$http.put(apiEndpointWithName('changeStatuses'), null, { params: { model: model.id.uri, initialStatus, endStatus } })
//       .then(() => {
//         const modelId: string = model.id.uri;

//         this.defaultClassService.clearCachedClasses(modelId);
//         this.defaultPredicateService.clearCachedPredicates(modelId);
//         this.contentExpired$.next(modelId);
//       });
//   }

//   getModelResourcesTotalCountByStatus(model: Model, resourceStatus: Status): IPromise<number> {
//     return this.$http.get<{ meta: { totalResults: number } }>(apiEndpointWithName('integration/resources'), { params: { container: model.id.uri, status: resourceStatus, pageSize: 0 } })
//       .then(response => response.data!.meta.totalResults);
//   }

//   createNewModelVersion(newPrefix: string, uri: string): IPromise<any> {
//     return this.$http.post<{ uri: string }>(apiEndpointWithName('modelVersion'), null, { params: { newPrefix, uri } })
//       .then(response => response.data.uri);
//   }

//   private deserializeModelList(data: GraphData): Promise<ModelListItem[]> {
//     return this.frameService.frameAndMapArray(data, frames.modelListFrame(data), () => ModelListItem);
//   }

//   private deserializeModel(data: GraphData): Promise<Model> {
//     return this.frameService.frameAndMap(data, false, frames.modelFrame(data), () => Model).then(requireDefined);
//   }

//   private deserializeModelById(data: GraphData, id: Uri | Urn): Promise<Model> {
//     return this.frameService.frameAndMap(data, true, frames.modelFrame(data, { id }), () => Model).then(requireDefined);
//   }

//   private deserializeModelByPrefix(data: GraphData, prefix: string): Promise<Model> {
//     return this.frameService.frameAndMap(data, true, frames.modelFrame(data, { prefix }), () => Model).then(requireDefined);
//   }

//   private deserializeImportedNamespace(data: GraphData): Promise<ImportedNamespace> {
//     return this.frameService.frameAndMap(data, false, frames.namespaceFrame(data), () => ImportedNamespace).then(requireDefined);
//   }

//   private deserializeImportedNamespaces(data: GraphData): Promise<ImportedNamespace[]> {
//     return this.frameService.frameAndMapArray(data, frames.namespaceFrame(data), () => ImportedNamespace);
//   }
// }


export interface ModelService {

  contentExpired$: BehaviorSubject<string | undefined>;

  getModels(): Promise<ModelListItem[]>;

  getModelByUrn(urn: Uri | Urn): Promise<Model>;

  getModelByPrefix(prefix: string): Promise<Model>;

  createModel(model: Model): Promise<any>;

  updateModel(model: Model): Promise<any>;

  deleteModel(id: Uri): Promise<any>;

  newModel(prefix: string, label: string, classifications: string[], organizations: string[], lang: Language[], type: KnownModelType, redirect?: Uri): Promise<Model>;

  newModelRequirement(model: Model, resourceUri: string): Promise<any>;

  newLink(title: string, description: string, homepage: Uri, lang: Language): Promise<Link>;

  getAllImportableNamespaces(): Promise<ImportedNamespace[]>;

  newNamespaceImport(namespace: string, prefix: string, label: string, lang: Language | string): Promise<ImportedNamespace>;

  changeStatuses(model: Model, initialStatus: Status, endStatus: Status): Promise<any>;

  getModelResourcesTotalCountByStatus(model: Model, resourceStatus: Status): Promise<number>;

  createNewModelVersion(newPrefix: string, uri: string): Promise<any>
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DefaultPredicateService } from './predicateService';

@Injectable({
  providedIn: 'root'
})
export class DefaultModelService {

  contentExpired$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(private http: HttpClient,
              private frameService: FrameService,
              private defaultClassService: DefaultClassService,
              private defaultPredicateService: DefaultPredicateService
              ) {}

  getModels(): Promise<ModelListItem[]> {
    return this.http.get<GraphData>(apiEndpointWithName('model'))
      .toPromise().then(response => this.deserializeModelList(response));
  }

  getModelByUrn(urn: Uri | Urn): Promise<Model> {
    return this.http.get<GraphData>(apiEndpointWithName('model'), { params: { id: urn.toString() } })
      .toPromise().then(response => this.deserializeModelById(response, urn));
  }

  getModelByPrefix(prefix: string): Promise<Model> {
    return this.http.get<GraphData>(apiEndpointWithName('model'), { params: { prefix } })
      .toPromise().then(response => this.deserializeModelByPrefix(response, prefix));
  }

  createModel(model: Model): Promise<any> {
    return this.http.put<{ identifier: Urn }>(apiEndpointWithName('model'), model.serialize())
      .toPromise().then(response => {
          model.unsaved = false;
          model.version = response.identifier;
          model.createdAt = moment().utc();
          model.modifiedAt = moment().utc();
        });
  }

  updateModel(model: Model): Promise<any> {
    return this.http.post<{ identifier: Urn }>(apiEndpointWithName('model'), model.serialize(), { params: { id: model.id.uri } })
      .toPromise().then(response => {
          model.version = response.identifier;
          model.modifiedAt = moment().utc();
        });
  }

  deleteModel(id: Uri): Promise<any> {
    const modelId: string = id.uri;
    this.defaultClassService.clearCachedClasses(modelId);
    this.defaultPredicateService.clearCachedPredicates(modelId);
    return this.http.delete(apiEndpointWithName('model'), { params: { id: modelId } }).toPromise();
  }

  newModel(prefix: string, label: string, classifications: string[], organizations: string[], lang: Language[], type: KnownModelType, redirect?: Uri): Promise<Model> {

    function mapEndpoint() {
      switch (type) {
        case 'library':
          return 'modelCreator';
        case 'profile':
          return 'profileCreator';
        default:
          return assertNever(type, 'Unknown type: ' + type);
      }
    }

    return this.http.get<GraphData>(apiEndpointWithName(mapEndpoint()), {
      params: {
        prefix,
        label: upperCaseFirst(label),
        lang: lang[0],
        langList: lang.join(' '),
        redirect: String(redirect && redirect.uri),
        serviceList: classifications.join(' '),
        orgList: organizations.join(' ')
      }
    })
      .toPromise()
      .then(response => this.deserializeModel(response))
      .then((model: Model) => {
          model.unsaved = true;
          return model;
        });
  }

  newModelRequirement(model: Model, resourceUri: string): Promise<any> {
    return this.http.put<{ identifier: Urn }>(apiEndpointWithName('newModelRequirement'), model.serialize(), { params: { model: model.id.uri, resource: resourceUri} })
      .toPromise()
      .then(response => {
        // TODO: Handling of the returned model
      });
  }

  newLink(title: string, description: string, homepage: Uri, lang: Language) {
    const graph = {
      title: {
        [lang]: title
      },
      description: {
        [lang]: description
      },
      homepage: homepage.url
    };

    const frameObject = frames.modelFrame({ '@graph': graph, '@context': {} });

    return Promise.resolve(new Link(graph, {}, frameObject));
  }

  getAllImportableNamespaces(): Promise<ImportedNamespace[]> {
    return this.http.get<GraphData>(apiEndpointWithName('listNamespaces'))
      .toPromise()
      .then(response => this.deserializeImportedNamespaces(response));
  }

  newNamespaceImport(namespace: string, prefix: string, label: string, lang: Language): Promise<ImportedNamespace> {
    return this.http.get<GraphData>(apiEndpointWithName('modelRequirementCreator'), { params: { namespace, prefix, label, lang } })
      .toPromise()
      .then(response => this.deserializeImportedNamespace(response));
  }

  changeStatuses(model: Model, initialStatus: Status, endStatus: Status): Promise<any> {
    return this.http.put(apiEndpointWithName('changeStatuses'), null, { params: { model: model.id.uri, initialStatus, endStatus } })
      .toPromise()
      .then(() => {
        const modelId: string = model.id.uri;

        this.defaultClassService.clearCachedClasses(modelId);
        this.defaultPredicateService.clearCachedPredicates(modelId);
        this.contentExpired$.next(modelId);
      });
  }

  getModelResourcesTotalCountByStatus(model: Model, resourceStatus: Status): Promise<number> {
    return this.http.get<{ meta: { totalResults: number } }>(apiEndpointWithName('integration/resources'), { params: { container: model.id.uri, status: resourceStatus, pageSize: 0 } })
      .toPromise()
      .then(response => response.meta.totalResults);
  }

  createNewModelVersion(newPrefix: string, uri: string): Promise<any> {
    return this.http.post<{ uri: string }>(apiEndpointWithName('modelVersion'), null, { params: { newPrefix, uri } })
      .toPromise()
      .then(response => response.uri);
  }

  private deserializeModelList(data: GraphData): Promise<ModelListItem[]> {
    return this.frameService.frameAndMapArray(data, frames.modelListFrame(data), () => ModelListItem);
  }

  private deserializeModel(data: GraphData): Promise<Model> {
    return this.frameService.frameAndMap(data, false, frames.modelFrame(data), () => Model).then(requireDefined);
  }

  private deserializeModelById(data: GraphData, id: Uri | Urn): Promise<Model> {
    return this.frameService.frameAndMap(data, true, frames.modelFrame(data, { id }), () => Model).then(requireDefined);
  }

  private deserializeModelByPrefix(data: GraphData, prefix: string): Promise<Model> {
    return this.frameService.frameAndMap(data, true, frames.modelFrame(data, { prefix }), () => Model).then(requireDefined);
  }

  private deserializeImportedNamespace(data: GraphData): Promise<ImportedNamespace> {
    return this.frameService.frameAndMap(data, false, frames.namespaceFrame(data), () => ImportedNamespace).then(requireDefined);
  }

  private deserializeImportedNamespaces(data: GraphData): Promise<ImportedNamespace[]> {
    return this.frameService.frameAndMapArray(data, frames.namespaceFrame(data), () => ImportedNamespace);
  }

}
