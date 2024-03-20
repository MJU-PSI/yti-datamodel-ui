import { collectProperties } from '@mju-psi/yti-common-ui';
import { IScope } from 'angular';
import { LanguageService } from '../../services/languageService';
import { LegacyComponent, modalCancelHandler } from '../../utils/angular';
import { createExistsExclusion } from '../../utils/exclusion';
import { EditableForm } from '../form/editableEntityController';
import { ColumnDescriptor, TableDescriptor } from '../form/editableTable';
import { SearchUserModal } from './searchUserModal';
import { User } from 'app/entities/model';
import { UsersService } from 'app/services/usersService';
import { fromIPromise } from 'app/utils/observable';

interface WithUsers {
  users: User[];
  addUser(user: User): void;
  removeUser(user: User): void;
}

@LegacyComponent({
  bindings: {
    value: '=',
    required: '='
  },
  require: {
    form: '?^form'
  },
  template: `
      <h4>
        <span translate>Users</span>
        <button id="add_users_button" type="button" class="btn btn-link btn-xs pull-right" ng-click="$ctrl.addUser()" ng-show="$ctrl.isEditing()">
          <span translate>Add user</span>
        </button>
      </h4>
      <editable-table id="'users'" descriptor="$ctrl.descriptor" expanded="$ctrl.expanded"></editable-table>
  `
})
export class UsersViewComponent {

  value: WithUsers;

  descriptor: UserTableDescriptor;
  expanded: boolean;

  form: EditableForm;

  users: User[];

  constructor(private $scope: IScope,
              private searchUserModal: SearchUserModal,
              private usersService: UsersService) {
    'ngInject';
  }

  $onInit() {
    this.$scope.$watch(() => this.value, value => {
      fromIPromise(this.usersService.getUsers()).subscribe( users => {
        this.users = users;
        value.users.forEach((user, index) => {
          const matchedUserIndex = this.users.findIndex(u => u.id === user.id);
          if (matchedUserIndex !== -1) {
            value.users[index] = this.users[matchedUserIndex];
          }
        });
        this.descriptor = new UserTableDescriptor(value);
      })
    });
  }

  isEditing() {
    return this.form && this.form.editing;
  }

  addUser() {

    const userIds = collectProperties(this.value.users, u => u.id);
    const exclude = createExistsExclusion(userIds);

    this.searchUserModal.open(exclude)
      .then((user: User) => {
        this.value.addUser(user);
        this.expanded = true;
      }, modalCancelHandler);
  }
}

class UserTableDescriptor extends TableDescriptor<User> {



  constructor(private value: WithUsers) {
    super();
  }

  columnDescriptors(): ColumnDescriptor<User>[] {
    return [
      { headerName: 'Name', nameExtractor: user => user.firstName + " " + user.lastName }
    ];
  }

  values(): User[] {
    return this.value && this.value.users;
  }

  canEdit(_user: User): boolean {
    return false;
  }

  canRemove(user: User): boolean {
    return this.value.users.length > 0;
  }

  remove(user: User): any {
    this.value.removeUser(user);
  }

  orderBy(u: User) {
    return u.firstName + " " + u.lastName;
  }
}
