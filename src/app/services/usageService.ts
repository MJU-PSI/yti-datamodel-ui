import { IHttpService, IPromise } from 'angular';
import { EditableEntity, GraphData } from 'app/types/entity';
import { FrameService } from './frameService';
import { usageFrame } from 'app/entities/frames';
import { Usage, EmptyUsage, DefaultUsage } from 'app/entities/usage';
import { apiEndpointWithName } from './config';

// export class UsageService {

//   constructor(private $http: IHttpService, private frameService: FrameService) {
//     'ngInject';
//   }

//   getUsage(entity: EditableEntity): IPromise<Usage> {
//     const params = entity.isOfType('model')   ? { model:   entity.id.uri }
//                  : entity.isOfType('concept') ? { concept: entity.id.uri }
//                                               : { id:      entity.id.uri };

//     return this.$http.get<GraphData>(apiEndpointWithName('usage'), {params})
//       .then(response => this.deserializeUsage(response.data!))
//       .then(usage => {
//         if (usage) {
//           return usage;
//         } else {
//           return new EmptyUsage(entity);
//         }
//       });
//   }

//   private deserializeUsage(data: GraphData): IPromise<Usage|null> {
//     return this.frameService.frameAndMap(data, true, usageFrame(data), () => DefaultUsage);
//   }
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsageService {

  constructor(private http: HttpClient, private frameService: FrameService) { }

  getUsage(entity: EditableEntity): Promise<Usage> {
    const params = entity.isOfType('model')   ? new HttpParams().set('model', entity.id.uri)
                 : entity.isOfType('concept') ? new HttpParams().set('concept', entity.id.uri)
                                              : new HttpParams().set('id', entity.id.uri);

    return this.http.get<GraphData>(apiEndpointWithName('usage'), {params})
      .toPromise()
      .then(response => this.deserializeUsage(response))
      .then(usage => {
        if (usage) {
          return usage;
        } else {
          return new EmptyUsage(entity);
        }
      });
  }

  private deserializeUsage(data: GraphData): Promise<Usage|null> {
    return this.frameService.frameAndMap(data, true, usageFrame(data), () => DefaultUsage);
  }
}
