import { IAttributes, IScope } from 'angular';
import { module as mod } from './module';
import { ModelViewController } from './modelView';
import { Model } from 'app/entities/model';
import { ModelControllerService } from './modelControllerService';

mod.directive('modelForm', () => {
  return {
    scope: {
      id: '=',
      model: '=',
      modelController: '='
    },
    restrict: 'E',
    template: require('./modelForm.html'),
    controllerAs: 'ctrl',
    bindToController: true,
    require: ['modelForm', '?^modelView'],
    controller: ModelFormController,
    link(_$scope: IScope, _element: JQuery, _attributes: IAttributes, [modelFormController, modelViewController]: [ModelFormController, ModelViewController]) {
      modelFormController.isEditing = () => modelViewController && modelViewController.isEditing();
    }
  };
});

class ModelFormController {
  model: Model;
  modelController: ModelControllerService;
  isEditing: () => boolean;
}
