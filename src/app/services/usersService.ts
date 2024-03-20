import { IHttpService, IPromise } from 'angular';
import { apiEndpointWithName } from './config';
import { User } from 'app/entities/model';

export class UsersService {

  constructor(private $http: IHttpService) {
    'ngInject';
  }

  getUsers(): IPromise<User[]> {

    return this.$http.get<User[]>(apiEndpointWithName('users'))
      .then(response => response.data!)
      .then(users => {
        return users;
      });
  }
}
