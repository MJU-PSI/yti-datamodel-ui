import { IHttpService, IPromise } from 'angular';
import { Uri } from 'app/entities/uri';
import { Role } from '@mju-psi/yti-common-ui';
import { apiEndpointWithName } from './config';

export interface UserRequest {
  organizationId: string;
  role: Role[];
}

export class UserRoleService {


  constructor(private $http: IHttpService) {
    'ngInject';
  }

  sendUserRequest(id: Uri): IPromise<any> {

    const requestParams = {
      organizationId: id.uuid
    };

    return this.$http.post<UserRequest[]>(apiEndpointWithName('userRequest'), undefined, {params: requestParams})
      .then(response => response.data!);
  }

  getUserRequests(): IPromise<UserRequest[]> {
    return this.$http.get<UserRequest[]>(apiEndpointWithName('userRequest'))
      .then(response => response.data!);
  }
}
