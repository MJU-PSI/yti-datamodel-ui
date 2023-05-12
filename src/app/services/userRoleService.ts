import { IHttpService, IPromise } from 'angular';
import { Uri } from 'app/entities/uri';
import { Role } from '@mju-psi/yti-common-ui';
import { apiEndpointWithName } from './config';

// export interface UserRequest {
//   organizationId: string;
//   role: Role[];
// }

// export class UserRoleService {


//   constructor(private $http: IHttpService) {
//     'ngInject';
//   }

//   sendUserRequest(id: Uri): IPromise<any> {

//     const requestParams = {
//       organizationId: id.uuid
//     };

//     return this.$http.post<UserRequest[]>(apiEndpointWithName('userRequest'), undefined, {params: requestParams})
//       .then(response => response.data!);
//   }

//   getUserRequests(): IPromise<UserRequest[]> {
//     return this.$http.get<UserRequest[]>(apiEndpointWithName('userRequest'))
//       .then(response => response.data!);
//   }
// }


import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface UserRequest {
  organizationId: string;
  role: Role[];
}

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) {}

  sendUserRequest(id: Uri): Promise<UserRequest[]> {
    const requestParams = new HttpParams().set('organizationId', id.uuid);
    return this.http.post<UserRequest[]>(apiEndpointWithName('userRequest'), null, { params: requestParams })
      .toPromise()
      .then(response => response || []);
  }


  getUserRequests(): Promise<UserRequest[]> {
    return this.http.get<UserRequest[]>(apiEndpointWithName('userRequest'))
      .toPromise()
      .then(response => response || []);
  }
}
