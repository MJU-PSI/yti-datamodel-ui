// import { IHttpService, IPromise } from 'angular';
// import { apiEndpointWithName } from './config';

// export class ResetService {

//   constructor(private $http: IHttpService) {
//     'ngInject';
//   }

//   reset(): IPromise<any> {
//     return this.$http.get(apiEndpointWithName('reset'));
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiEndpointWithName } from './config';
import { Injectable } from '@angular/core';

@Injectable()
export class ResetService {

  constructor(private http: HttpClient) {}

  reset(): Observable<any> {
    return this.http.get(apiEndpointWithName('reset'));
  }
}
