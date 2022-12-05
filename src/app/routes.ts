import * as angular from 'angular';
import { Uri } from './entities/uri';
import { ILocationService } from 'angular';
import { resourceUrl, modelUrl } from './utils/entity';
import { NotificationModal } from './components/common/notificationModal';

export function routeConfig($routeProvider: angular.route.IRouteProvider) {
  'ngInject';

  $routeProvider
    .when('/', {
      template: '<front-page></front-page>'
    })
    .when('/information', {
      template: '<information-about-service-page></information-about-service-page>'
    })
    .when('/user', {
      template: '<app-user-details></app-user-details>'
    })
    .when('/group', {
      template: '<group-page group-id="groupId"></group-page>',
      controller: function($scope: any, $route: angular.route.IRouteService) {
        'ngInject';
        $scope.groupId = new Uri($route.current!.params.id, {});
      }
    })
    .when('/newModel', {
      template: '<new-model-page type="type"></new-model-page>',
      controller: function($scope: any, $route: angular.route.IRouteService) {
        'ngInject';
        const params: any = $route.current!.params;
        $scope.type = params.type;
      }
    })
    .when('/ns/:prefix*', {
      template: '',
      controller: function($location: ILocationService, $route: angular.route.IRouteService) {
        'ngInject';

        const prefix = $route.current!.params.prefix;
        const resource = $location.hash();

        if (resource) {
          $location.url(resourceUrl(prefix, resource));
        } else {
          $location.url(modelUrl(prefix));
        }
      }
    })
    .when('/model/:prefix/:resource?/:property?', {
      template: '<model-main></model-main>',
      reloadOnSearch: false
    })
    .otherwise({
      template: '',
      controller: function(notificationModal: NotificationModal) {
        'ngInject';
        notificationModal.openPageNotFound();
      }
    });
}
