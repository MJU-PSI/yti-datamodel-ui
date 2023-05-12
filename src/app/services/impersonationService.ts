// import { IHttpService } from 'angular';
// import { apiEndpointWithName } from './config';

// export class ImpersonationService {

//   constructor(private $http: IHttpService) {
//     'ngInject';
//   }

//   getFakeableUsers() {
//     return this.$http.get<{ email: string, firstName: string, lastName: string }[]>(apiEndpointWithName('fakeableUsers'))
//       .then(result => result.data!);
//   }
// }


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { apiEndpointWithName } from './config';

// @Injectable({
//   providedIn: 'root'
// })
// export class ImpersonationService {

//   constructor(private http: HttpClient) {}

//   getFakeableUsers(): Observable<{ email: string, firstName: string, lastName: string }[]> {
//     return this.http.get<{ email: string, firstName: string, lastName: string }[]>(apiEndpointWithName('fakeableUsers'));
//   }
// }

import { HttpClient } from '@angular/common/http';
import { apiEndpointWithName } from './config';
import { Injectable } from '@angular/core';

@Injectable()
export class ImpersonationService {

  constructor(private http: HttpClient) {}

  getFakeableUsers(): Promise<{ email: string, firstName: string, lastName: string }[]> {
    return this.http.get<{ email: string, firstName: string, lastName: string }[]>(apiEndpointWithName('fakeableUsers'))
      .toPromise();
  }
}

