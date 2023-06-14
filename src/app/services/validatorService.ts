import { IPromise, IHttpService, IQService } from 'angular';
import { Uri } from 'app/entities/uri';
import { pascalCase, camelCase } from 'change-case';
import { apiEndpointWithName } from './config';

// export interface ValidatorService {
//   classDoesNotExist(id: Uri): IPromise<boolean>;
//   predicateDoesNotExist(id: Uri): IPromise<boolean>;
//   predicateDoesNotExist(id: Uri): IPromise<boolean>;
//   prefixDoesNotExists(prefix: string): IPromise<boolean>
// }

// export class DefaultValidatorService implements DefaultValidatorService {

//   constructor(private $q: IQService, private $http: IHttpService) {
//     'ngInject';
//   }

//   classDoesNotExist(id: Uri): IPromise<boolean> {
//     return this.idDoesNotExist(id.withName(pascalCase(id.name)));
//   }

//   predicateDoesNotExist(id: Uri): IPromise<boolean> {
//     return this.idDoesNotExist(id.withName(camelCase(id.name)));
//   }

//   prefixDoesNotExists(prefix: string): IPromise<boolean>  {
//     return this.$http.get(apiEndpointWithName('freePrefix'), {params: {prefix}})
//       .then(result => result.data ? true : this.$q.reject('exists'), _err => true);
//   }

//   private idDoesNotExist(id: Uri): IPromise<boolean> {
//     return this.$http.get(apiEndpointWithName('freeID'), {params: {id: id.uri}})
//       .then(result => result.data ? true : this.$q.reject('exists'), _err => true);
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ValidatorService {
  classDoesNotExist(id: Uri): Promise<boolean>;
  predicateDoesNotExist(id: Uri): Promise<boolean>;
  prefixDoesNotExists(prefix: string): Promise<boolean>;
}

@Injectable()
export class DefaultValidatorService implements ValidatorService {
  constructor(private http: HttpClient) {}

  classDoesNotExist(id: Uri): Promise<boolean> {
    return this.idDoesNotExist(id.withName(pascalCase(id.name)));
  }

  predicateDoesNotExist(id: Uri): Promise<boolean> {
    return this.idDoesNotExist(id.withName(camelCase(id.name)));
  }

  prefixDoesNotExists(prefix: string): Promise<boolean> {
    return this.http
      .get(apiEndpointWithName('freePrefix'), { params: { prefix } })
      .toPromise()
      .then((result: boolean) => (result))
      .catch(() => true);
  }

  private idDoesNotExist(id: Uri): Promise<boolean> {
    return this.http
      .get(apiEndpointWithName('freeID'), { params: { id: id.uri } })
      .toPromise()
      .then((result: boolean) => ( result ))
      .catch(() => true);
  }
}
