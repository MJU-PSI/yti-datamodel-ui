import { InjectionToken } from '@angular/core';
import { User } from 'app/entities/user';
import { Observable } from 'rxjs';

export interface UserService {
  user: User;
  user$: Observable<User>;
  updateLoggedInUser(fakeLoginMail?: string): Promise<void>;
  isLoggedIn(): boolean;
  register(): void;
  login(): void;
  logout(): void;
}

export const USER_SERVICE = new InjectionToken<UserService>('UserService');

