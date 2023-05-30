
// import * as angular from 'angular';

// export const module6 = angular.module('iow.components.navigation', ['iow.services']);

import { NgModule } from '@angular/core';
import { IowServicesModule } from 'app/services/module';

import { NavigationBarComponent } from './navigation-bar.component';
import { BreadcrumbComponent } from './breadcrumb.component';

import { USER_SERVICE, } from 'app/services/userService';
import { UserService, YtiCommonModule } from '@mju-psi/yti-common-ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { IowComponentsCommonModule } from '../common/module';


@NgModule({
  declarations: [
    NavigationBarComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    YtiCommonModule,
    TranslateModule,
    NgbModule,
    RouterModule,
    IowServicesModule,
    IowComponentsCommonModule
  ],
  providers: [
    { provide: USER_SERVICE, useClass: UserService }
  ],
  exports: [
    NavigationBarComponent,
    BreadcrumbComponent
  ],
})
export class IowComponentsNavigation { }
