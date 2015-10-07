const angular = require('angular');

require('angular-gettext');
require('./vendor/angular-xeditable-0.1.8/js/xeditable');

angular.module('iow-ui', [
  require('angular-route'),
  require('angular-ui-bootstrap'),
  'gettext',
  'xeditable',
  require('./components'),
  require('./services'),
  require('./controllers')
])
.config(function mainConfig($routeProvider) {
  $routeProvider
    .when('/', {
      template: require('./views/index.html')
    })
    .when('/groups', {
      template: require('./views/group.html'),
      controller: 'groupController'
    })
    .when('/models', {
      template: require('./views/model.html'),
      controller: 'modelController'
    });
})
.run(function onAppRun($rootScope, editableOptions, languageService) {
  editableOptions.theme = 'bs3';
  languageService.setLanguage('fi');
  $rootScope.language = languageService.getLanguage();
})
.controller('AppCtrl', function mainAppCtrl($scope, $location) {

});
