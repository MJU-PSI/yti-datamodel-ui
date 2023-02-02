import { User } from 'app/entities/user';
import { IPromise, IQService } from 'angular';
import { ResetableService } from './resetableService';
import { Role, UUID } from '@mju-psi/yti-common-ui';
import { UserService } from 'app/services/userService';
import { BehaviorSubject, Observable, of } from 'rxjs';

// TODO fix to align with yti-common-ui UserService

class InteractiveHelpUser implements User {

  name = 'Ohjekäyttäjä';
  anonymous = false;
  superuser = false;

  isInRole(role: Role | Role[], organizationIds: UUID | UUID[]): boolean {
    return true;
  }

  isInOrganization(organizationIds: UUID | UUID[], roles: Role | Role[]): boolean {
    return true;
  }

  isInRoleInAnyOrganization(role: Role|Role[]) {
    return true;
  }
}

export class InteractiveHelpUserService implements UserService, ResetableService {

  private _user$ = new BehaviorSubject<User>(new InteractiveHelpUser());

  constructor(private $q: IQService) {
    'ngInject';
  }

  get loggedIn$(): Observable<boolean> {
    return of(true);
  }

  get user(): User {
    return this._user$.value;
  }

  get user$(): Observable<User> {
    return this._user$.asObservable();
  }

  updateLoggedInUser(fakeLoginMail?: string): Promise<void> {
    throw new Error();
  }

  register(): void {
    throw new Error();
  }

  login(): void {
    throw new Error();
  }

  isLoggedIn(): boolean {
    return true;
  }

  logout(): void {
    throw new Error('Should not be able to logout when in help');
  }

  reset(): IPromise<any> {
    return this.$q.when();
  }
}
