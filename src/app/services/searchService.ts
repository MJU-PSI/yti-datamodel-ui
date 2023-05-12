// import { IPromise, IHttpService } from 'angular';
import { Language } from 'app/types/language';
import { GraphData } from 'app/types/entity';
import { FrameService } from './frameService';
import { searchResultFrame } from 'app/entities/frames';
import { SearchResult } from 'app/entities/search';
import { apiEndpointWithName } from './config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// export class SearchService {

//   constructor(private $http: IHttpService, private frameService: FrameService) {
//     'ngInject';
//   }

//   search(graph: string, search: string, language?: Language): IPromise<SearchResult[]> {
//     return this.$http.get<GraphData>(apiEndpointWithName('search'), {params: {graph, search, lang: language}})
//       .then(response => this.deserializeSearch(response.data!));
//   }

//   private deserializeSearch(data: GraphData): Promise<SearchResult[]> {
//     return this.frameService.frameAndMapArray(data, searchResultFrame(data), () => SearchResult);
//   }
// }


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient, private frameService: FrameService) {}

  search(graph: string, search: string, language?: Language): Promise<SearchResult[]> {
    return this.http.get<GraphData>(apiEndpointWithName('search'), {params: {graph, search, lang: String(language)}})
      .toPromise()
      .then(response => this.deserializeSearch(response));
  }

  private deserializeSearch(data: GraphData): Promise<SearchResult[]> {
    return this.frameService.frameAndMapArray(data, searchResultFrame(data), () => SearchResult);
  }
}


