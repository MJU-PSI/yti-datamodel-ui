import { IAttributes, IScope } from 'angular';
import { UserService } from '../../services/userService';
import { module as mod } from './module';
import { EditableForm } from './editableEntityController';
import { State } from '../../entities/type';
import { Model } from '../../entities/model';

const userStates: State[] = ['Unstable', 'Draft'];
const adminStates: State[] = userStates.concat(['Recommendation', 'Deprecated']);

mod.directive('editableStateSelect', () => {
  return {
    scope: {
      state: '=',
      model: '=',
      id: '@'
    },
    restrict: 'E',
    template: `
      <div>
        <iow-select ng-if="ctrl.isEditing()" id="{{ctrl.id}}" options="state in ctrl.getStates()" ng-model="ctrl.state">
          <i ng-class="ctrl.classForState(state)"></i>
          <span>{{state | translate}}</span>
        </iow-select>

        <div class="non-editable" ng-if="!ctrl.isEditing()">
          <i ng-class="ctrl.classForState(ctrl.state)"></i>
          <span>{{ctrl.state | translate}}</span>
        </div>
      </div>
    `,
    controllerAs: 'ctrl',
    bindToController: true,
    require: ['editableStateSelect', '?^form'],
    link(_$scope: IScope, _element: JQuery, _attributes: IAttributes, [thisController, editableController]: [StateSelectController, EditableForm]) {
      thisController.isEditing = () => editableController && editableController.editing;
    },
    controller: StateSelectController
  };
});

class StateSelectController {

  model: Model;
  state: State;
  id: string;
  isEditing: () => boolean;

  /* @ngInject */
  constructor(private userService: UserService) {
  }

  getStates() {
    return this.userService.user.isAdminOf(this.model) ? adminStates : userStates;
  }

  classForState(state: State) {
    switch (state) {
      case 'Unstable':
      case 'Deprecated':
        return ['fa', 'fa-exclamation-circle', 'danger'];
      case 'Draft':
        return ['fa', 'fa-check-circle', 'warning'];
      case 'Recommendation':
        return ['fa', 'fa-check-circle', 'success'];
      default:
        throw new Error('Unsupported state: ' + state);
    }
  }
}
