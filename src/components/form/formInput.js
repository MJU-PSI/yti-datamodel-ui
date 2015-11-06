module.exports = function formInputDirective($log) {
  'ngInject';
  return {
    scope: {
      title: '@',
      titleEditOnly: '@',
      content: '=',
      plainText: '='
    },
    restrict: 'E',
    template: require('./formInput.html'),
    controllerAs: 'inputController',
    bindToController: true,
    require: '^editableForm',
    link(scope, element, attributes, editableFormController) {
      scope.formController = editableFormController;
    },
    controller(modelLanguage) {
      'ngInject';

      const vm = this;
      vm.getLanguage = modelLanguage.getLanguage;
      vm.hasContent = () => vm.plainText || (vm.content && vm.content[modelLanguage.getLanguage()]);
    }
  };
};
