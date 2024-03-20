import { IPromise, IScope } from 'angular';
import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
import { Exclusion } from 'app/utils/exclusion';
import { WithId } from 'app/types/entity';
import { UsersService } from 'app/services/usersService';
import { comparingPrimitive } from '@mju-psi/yti-common-ui';
import { User } from 'app/entities/model';
import { SearchController, SearchFilter, TextAnalysis } from 'app/types/filter';
import { filterAndSortSearchResults } from '../filter/util';

export class SearchUserModal {

  constructor(private $uibModal: IModalService) {
    'ngInject';
  }

  open(exclude: Exclusion<WithId>): IPromise<User> {
    return this.$uibModal.open({
      template: require('./searchUserModal.html'),
      size: 'md',
      resolve: {
        exclude: () => exclude
      },
      controller: SearchUserModalController,
      controllerAs: '$ctrl'
    }).result;
  }
}

class SearchUserModalController implements SearchController<User> {

  searchResults: User[];
  users: User[];
  searchText = '';
  loadingResults: boolean;

  contentExtractors = [ (u: User) => u.id, (u: User) => u.firstName + " " + u.lastName ];

  searchFilters: SearchFilter<User>[] = [];

  constructor($scope: IScope,
              private $uibModalInstance: IModalServiceInstance,
              usersService: UsersService,
              public exclude: Exclusion<WithId>) {
    'ngInject';
    usersService.getUsers()
      .then(users => {
        this.users = users.filter(u => !exclude(u));
        this.search();
        this.loadingResults = false;
      });

      this.addFilter(user => user.item.email.includes(this.searchText));
  }

  addFilter(filter: SearchFilter<User>) {
    this.searchFilters.push(filter);
  }

  get items() {
    return this.users;
  }

  search() {
    const comparator = comparingPrimitive<TextAnalysis<User>>(item => !!this.exclude(item.item))
    .andThen(comparingPrimitive<TextAnalysis<User>>(item => item.item.email));

    this.searchResults = filterAndSortSearchResults(this.users, this.searchText, this.contentExtractors, this.searchFilters, comparator);
  }

  selectItem(user: User) {
    if (!this.exclude(user)) {
      this.$uibModalInstance.close(user);
    }
  }

  close() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
