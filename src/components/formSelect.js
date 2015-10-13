module.exports = function classView($log) {
  'ngInject';
  return {
    scope: {
      title: '@',
      content: '=',
      values: '='
    },
    restrict: 'E',
    template: require('./templates/formSelect.html'),
    controllerAs: 'inputController',
    bindToController: true,
    require: '^editableForm',
    link(scope, element, attributes, editableFormController) {
      scope.formController = editableFormController;
    },
    controller(gettextCatalog) {
      'ngInject';

      return {
        displayName(s) {
          return `${gettextCatalog.getString(s)} (${s})`;
        }
      };
    }
  };
};
