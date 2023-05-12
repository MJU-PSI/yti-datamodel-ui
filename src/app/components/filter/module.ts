// import * as angular from 'angular';

// export const module8 = angular.module('iow.components.filter', ['iow.services', 'iow.components.common']);

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ModelFilterComponent } from "./modelFilter";
import { TextFilterComponent } from "./textFilter";
import { ContentFilterComponent } from "./contentFilter";
import { ProfileFilterComponent } from "./profileFilter";
import { ExcludedFilterComponent } from "./excludedFilter";
import { TypeFilterComponent } from "./typeFilter";
import { TypesFilterComponent } from "./typesFilter";
import { IowServicesModule } from "app/services/module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IowComponentsCommonModule } from "../common/module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    TextFilterComponent,
    ContentFilterComponent,
    ModelFilterComponent,
    ProfileFilterComponent,
    ExcludedFilterComponent,
    TypeFilterComponent,
    TypesFilterComponent
  ],
  imports: [
    FormsModule,
    NgbModule,
    TranslateModule,
    IowServicesModule,
    IowComponentsCommonModule
  ],
  providers: [
    IowServicesModule
  ], 
  exports: [
    TextFilterComponent,
    ContentFilterComponent,
    ModelFilterComponent,
    ProfileFilterComponent,
    ExcludedFilterComponent,
    TypeFilterComponent,
    TypesFilterComponent
  ]
})
export class IowComponentsFilterModule { }
