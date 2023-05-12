// import * as angular from 'angular';
// export const module7 = angular.module('iow.components.information', ['iow.services']);

import { NgModule } from '@angular/core';
import { IowServicesModule } from 'app/services/module';
import { InformationAboutServicePageComponent } from './information-about-service-page.component';


@NgModule({
  imports: [
    IowServicesModule,
  ],
  declarations: [
    InformationAboutServicePageComponent
  ]
})
export class IowComponentsInformationModule { }
