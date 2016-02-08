import IHttpService = angular.IHttpService;
import IPromise = angular.IPromise;
import { EntityDeserializer, Usage, EditableEntity } from './entities';

export class UsageService {
  /* @ngInject */
  constructor(private $http: IHttpService, private entities: EntityDeserializer) {
  }

  getUsage(entity: EditableEntity): IPromise<Usage> {
    const params = entity.isOfType('model') ? { model: entity.id } : { id: entity.id };

    return this.$http.get('/api/rest/usage', {params})
      .then(response => this.entities.deserializeUsage(response.data));
  }
}
