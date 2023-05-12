// import { IHttpService, IPromise } from 'angular';
// import { Config } from 'app/entities/config';
// import { apiEndpointWithName } from './config';

// interface ConfigType {
//   groupsFrontend: string;
//   conceptsFrontend: string;
//   codesFrontend: string;
//   commentsFrontend: string;
//   messagingEnabled: boolean;
//   dev: boolean;
//   env: string;
// }

// export class ConfigService {

//   constructor(private $http: IHttpService) {
//     'ngInject';
//   }

//   getConfig(): IPromise<Config> {

//     return this.$http.get<ConfigType>(apiEndpointWithName('config'))
//       .then(response => {
//         const data = response.data!;
//         return new Config(data.groupsFrontend, data.conceptsFrontend, data.codesFrontend, data.commentsFrontend, data.messagingEnabled, data.dev, data.env);
//       });
//   }
// }


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from 'app/entities/config';
import { apiEndpointWithName } from './config';

interface ConfigType {
  groupsFrontend: string;
  conceptsFrontend: string;
  codesFrontend: string;
  commentsFrontend: string;
  messagingEnabled: boolean;
  dev: boolean;
  env: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {}

  getConfig(): Promise<Config> {
    return this.http.get<ConfigType>(apiEndpointWithName('config')).toPromise()
      .then(response => {
          const data = response;
          return new Config(data.groupsFrontend, data.conceptsFrontend, data.codesFrontend, data.commentsFrontend, data.messagingEnabled, data.dev, data.env);
        });
  }
}
