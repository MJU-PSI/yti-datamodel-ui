// import { IHttpService, IPromise } from 'angular';
// import { Uri } from 'app/entities/uri';
// import { GraphData } from 'app/types/entity';
// import { FrameService } from './frameService';
// import * as frames from 'app/entities/frames';
// import { Activity } from 'app/entities/version';
// import { requireDefined } from '@mju-psi/yti-common-ui';
// import { apiEndpointWithName } from './config';

// export class HistoryService {

//   constructor(private $http: IHttpService, private frameService: FrameService) {
//     'ngInject';
//   }

//   getHistory(id: Uri): IPromise<Activity> {
//     return this.$http.get<GraphData>(apiEndpointWithName('history'), {params: {id: id.uri}})
//       .then(response => this.deserializeVersion(response.data!));
//   }

//   private deserializeVersion(data: GraphData): IPromise<Activity> {
//     return this.frameService.frameAndMap(data, false, frames.versionFrame(data), () => Activity).then(requireDefined);
//   }
// }


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Uri } from 'app/entities/uri';
import { GraphData } from 'app/types/entity';
import { FrameService } from './frameService';
import * as frames from 'app/entities/frames';
import { Activity } from 'app/entities/version';
import { requireDefined } from '@mju-psi/yti-common-ui';
import { apiEndpointWithName } from './config';

@Injectable()
export class HistoryService {

  constructor(private http: HttpClient, private frameService: FrameService) { }

  getHistory(id: Uri): Promise<Activity> {
    return this.http.get<GraphData>(apiEndpointWithName('history'), {params: {id: id.uri}})
      .toPromise()
      .then(response => this.deserializeVersion(response));
  }

  private deserializeVersion(data: GraphData): Promise<Activity> {
    return this.frameService.frameAndMap(data, false, frames.versionFrame(data), () => Activity)
      .then(requireDefined);
  }
}
