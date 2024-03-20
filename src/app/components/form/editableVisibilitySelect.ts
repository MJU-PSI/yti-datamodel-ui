import { EditableForm } from './editableEntityController';
import { Model } from 'app/entities/model';
import { LegacyComponent } from 'app/utils/angular';
import { allVisibilities } from '@mju-psi/yti-common-ui';

@LegacyComponent({
  bindings: {
    state: '=',
    model: '=',
    id: '@'
  },
  template: `
      <div class="form-group">

        <label translate>Visibility</label>

        <iow-select ng-if="$ctrl.isEditing()" id="{{$ctrl.id}}" id-prefix="$ctrl.id" options="state in $ctrl.getStates()" ng-model="$ctrl.state">
          <span>{{state | translate}}</span>
        </iow-select>

        <p ng-if="!$ctrl.isEditing()" class="form-control-static">{{$ctrl.state | translate}}</p>
      </div>
    `,
  require: {
    form: '?^form'
  }
})
export class EditableVisibilitySelectComponent {

  model: Model;
  id: string;

  form: EditableForm;

  constructor() {
    'ngInject';
  }

  isEditing() {
    return this.form && this.form.editing;
  }

  getStates() {
    return allVisibilities;
  }
}
