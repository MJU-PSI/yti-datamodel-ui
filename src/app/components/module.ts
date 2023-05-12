// import * as angular from 'angular';

// // TODO: Remove angular-sanitize when front page is upgraded to Angular X.
// export const module9 = angular.module('iow.components', ['iow.services', require('angular-sanitize')]);


import { NgModule } from "@angular/core";
import { FrontPageComponent } from "./frontPage";
import { ApplicationComponent } from "./application";
import { DefaultOrganizationService, ORGANIZATION_SERVICE } from "app/services/organizationService";
import { MaintenanceModal } from "./maintenance-modal";
import { IowServicesModule } from 'app/services/module';
import { IowComponentsNavigation } from "./navigation/module";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { YtiCommonModule } from "@mju-psi/yti-common-ui";
import { TranslateModule } from "@ngx-translate/core";
import { UserDetailsComponent } from "./userdetails/user-details.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserDetailsInformationComponent } from "./userdetails/user-details-information.component";
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    FrontPageComponent,
    ApplicationComponent,
    UserDetailsComponent,
    UserDetailsInformationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    IowServicesModule,
    IowComponentsNavigation,
    YtiCommonModule,
    TranslateModule,
    NgbModule
  ],
  providers: [
    MaintenanceModal,
    { provide: ORGANIZATION_SERVICE, useValue: DefaultOrganizationService }
  ]
})
export class IowComponentsModule { }
