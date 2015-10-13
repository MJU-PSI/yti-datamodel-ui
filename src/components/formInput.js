module.exports = function formInputDirective($log) {
  'ngInject';
  return {
    scope: {
      title: '@',
      content: '='
    },
    restrict: 'E',
    template: require('./templates/formInput.html'),
    controllerAs: 'inputController',
    bindToController: true,
    require: '^editableForm',
    link(scope, element, attributes, editableFormController) {
      scope.formController = editableFormController;
    },
    controller(modelLanguage) {
      'ngInject';

      return {
        getLanguage: modelLanguage.getLanguage,
        hasContentForLanguage() {
          return this.content && this.content[this.getLanguage()];
        }
      };
    }
  };
};
