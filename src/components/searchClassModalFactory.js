const _ = require('lodash');
const graphUtils = require('../services/graphUtils');

module.exports = function modalFactory($uibModal) {
  'ngInject';

  return {
    open(excludedClassMap = []) {
      return $uibModal.open({
        template: require('./templates/searchClassModal.html'),
        size: 'large',
        controller: SearchClassController,
        controllerAs: 'ctrl',
        resolve: {
          excludedClassMap: () => excludedClassMap
        }
      });
    }
  };
};

function SearchClassController($uibModalInstance, classService, modelLanguage, excludedClassMap, searchConceptModal) {
  'ngInject';

  const vm = this;
  let context;
  let classes;

  vm.close = $uibModalInstance.dismiss;
  vm.selectedClass = null;
  vm.searchText = '';
  vm.modelId = '';
  vm.models = [];

  classService.getAllClasses().then(result => {
    classes = _.reject(result['@graph'], klass => excludedClassMap[klass['@id']]);

    vm.models = _.chain(classes)
      .map(klass => klass.isDefinedBy)
      .uniq(db => db['@id'])
      .value();
  });

  vm.searchResults = () => {
    return _.chain(classes)
      .filter(textFilter)
      .filter(modelFilter)
      .sortBy(localizedLabelAsLower)
      .value();
  };

  vm.selectClass = (klass) => {
    classService.getClass(klass['@id']).then(result => {
      context = result['@context'];
      vm.selectedClass = result['@graph'][0];
    });
  };

  vm.isSelected = (klass) => {
    return klass['@id'] === selectedClassId();
  };

  vm.confirm = () => {
    $uibModalInstance.close(selectedClassId());
  };

  vm.createNewClass = () => {
    return searchConceptModal.open('Define concept for the new class').result.then(result => {
      $uibModalInstance.close(result);
    });
  };

  function selectedClassId() {
    return vm.selectedClass && graphUtils.withFullIRI(context, vm.selectedClass['@id']);
  }

  function localizedLabelAsLower(klass) {
    return modelLanguage.translate(klass.label).toLowerCase();
  }

  function textFilter(klass) {
    return !vm.searchText || localizedLabelAsLower(klass).includes(vm.searchText.toLowerCase());
  }

  function modelFilter(klass) {
    return !vm.modelId || klass.isDefinedBy['@id'] === vm.modelId;
  }
}
