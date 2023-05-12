// import { IHttpService, IPromise } from 'angular';
// import { upperCaseFirst } from 'change-case';
// import { apiEndpointWithName } from './config';
// import { Uri, Url } from 'app/entities/uri';
// import { Language } from 'app/types/language';
// import { FrameService } from './frameService';
// import { GraphData } from 'app/types/entity';
// import * as frames from 'app/entities/frames';
// import { Vocabulary, Concept } from 'app/entities/vocabulary';
// import { Model } from 'app/entities/model';
// import { requireDefined } from '@mju-psi/yti-common-ui';

// export interface VocabularyService {
//   getAllVocabularies(): IPromise<Vocabulary[]>;

//   searchConcepts(searchText: string, vocabulary?: Vocabulary): IPromise<Concept[]>;

//   createConceptSuggestion(vocabulary: Vocabulary, label: string, comment: string, lang: Language | string, model: Model): IPromise<Uri>;

//   getConcept(id: Uri): IPromise<Concept>;
// }

// export class DefaultVocabularyService implements VocabularyService {

//   constructor(private $http: IHttpService,
//               private frameService: FrameService) {
//     'ngInject';
//   }

//   getAllVocabularies(): IPromise<Vocabulary[]> {
//     return this.$http.get<GraphData>(apiEndpointWithName('conceptSchemes'))
//       .then(response => this.deserializeVocabularies(response.data!));
//   }

//   searchConcepts(searchText: string, vocabulary?: Vocabulary): IPromise<Concept[]> {

//     const params: any = {
//       // XXX: api wants search strings as lower case otherwise it finds nothing
//       term: (searchText ? searchText.toLowerCase() : '')
//     };

//     if (vocabulary) {
//       params.terminologyUri = vocabulary.id.uri
//     }

//     return this.$http.get<GraphData>(apiEndpointWithName('conceptSearch'), { params })
//       .then(response => this.deserializeConcepts(response.data!));
//   }

//   createConceptSuggestion(vocabulary: Vocabulary, label: string, definition: string, lang: Language, model: Model): IPromise<Uri> {
//     return this.$http.put<{ uri: string }>(apiEndpointWithName('conceptSuggestion'), null, {
//       params: {
//         terminologyUri: vocabulary.id.uri,
//         label: upperCaseFirst(label),
//         comment: definition,
//         lang,
//       }
//     })
//       .then(response => new Uri(response.data!.uri, {}));
//   }

//   getConcept(id: Uri): IPromise<Concept> {
//     return this.$http.get<GraphData>(apiEndpointWithName('concept'), {
//       params: { uri: id.uri }
//     })
//       .then(response => this.deserializeConcept(response.data!, id.uri));
//   }

//   deserializeConcept(data: GraphData, id: Url): IPromise<Concept> {
//     return this.frameService.frameAndMap(data, false, frames.conceptFrame(data, id), () => Concept).then(requireDefined);
//   }

//   deserializeConcepts(data: GraphData): Promise<Concept[]> {
//     return this.frameService.frameAndMapArray(data, frames.conceptListFrame(data), () => Concept);
//   }

//   deserializeVocabularies(data: GraphData): Promise<Vocabulary[]> {
//     return this.frameService.frameAndMapArray(data, frames.vocabularyFrame(data), () => Vocabulary);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { upperCaseFirst } from 'change-case';
import { apiEndpointWithName } from './config';
import { Uri, Url } from 'app/entities/uri';
import { Language } from 'app/types/language';
import { FrameService } from './frameService';
import { GraphData } from 'app/types/entity';
import * as frames from 'app/entities/frames';
import { Vocabulary, Concept } from 'app/entities/vocabulary';
import { Model } from 'app/entities/model';
import { requireDefined } from '@mju-psi/yti-common-ui';

export interface VocabularyService {
  getAllVocabularies(): Promise<Vocabulary[]>;

  searchConcepts(searchText: string, vocabulary?: Vocabulary): Promise<Concept[]>;

  createConceptSuggestion(vocabulary: Vocabulary, label: string, comment: string, lang: Language | string, model: Model): Promise<Uri>;

  getConcept(id: Uri): Promise<Concept>;
}


@Injectable({
  providedIn: 'root'
})
export class DefaultVocabularyService implements VocabularyService {

  constructor(private http: HttpClient, private frameService: FrameService) {}

  getAllVocabularies(): Promise<Vocabulary[]> {
    return this.http.get<GraphData>(apiEndpointWithName('conceptSchemes')).toPromise()
      .then(response => this.deserializeVocabularies(response));
  }

  searchConcepts(searchText: string, vocabulary?: Vocabulary): Promise<Concept[]> {
    let params = new HttpParams().set('term', searchText ? searchText.toLowerCase() : '');
    if (vocabulary) {
      params = params.set('terminologyUri', vocabulary.id.uri);
    }
    return this.http.get<GraphData>(apiEndpointWithName('conceptSearch'), { params }).toPromise()
      .then(response => this.deserializeConcepts(response));
  }

  createConceptSuggestion(vocabulary: Vocabulary, label: string, definition: string, lang: Language, model: Model): Promise<Uri> {
    const params = new HttpParams()
      .set('terminologyUri', vocabulary.id.uri)
      .set('label', upperCaseFirst(label))
      .set('comment', definition)
      .set('lang', lang);
    return this.http.put<{ uri: string }>(apiEndpointWithName('conceptSuggestion'), null, { params }).toPromise()
      .then(response => new Uri(response.uri, {}));
  }

  getConcept(id: Uri): Promise<Concept> {
    const params = new HttpParams().set('uri', id.uri);
    return this.http.get<GraphData>(apiEndpointWithName('concept'), { params }).toPromise()
      .then(response => this.deserializeConcept(response, id.uri));
  }

  deserializeConcept(data: GraphData, id: Url): Promise<Concept> {
    return this.frameService.frameAndMap(data, false, frames.conceptFrame(data, id), () => Concept).then(requireDefined);
  }

  deserializeConcepts(data: GraphData): Promise<Concept[]> {
    return this.frameService.frameAndMapArray(data, frames.conceptListFrame(data), () => Concept);
  }

  deserializeVocabularies(data: GraphData): Promise<Vocabulary[]> {
    return this.frameService.frameAndMapArray(data, frames.vocabularyFrame(data), () => Vocabulary);
  }
}
