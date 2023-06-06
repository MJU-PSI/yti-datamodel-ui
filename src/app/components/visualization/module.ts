// import * as angular from 'angular';


// export const module3 = angular.module('iow.components.visualization', ['iow.services']);

import { NgModule } from "@angular/core";
import { IowServicesModule } from "app/services/module";
import { ClassVisualizationComponent } from "./classVisualization";
import { VisualizationContextMenuComponent } from "./contextMenu";
import { VisualizationPopoverComponent } from "./popover";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { YtiCommonModule } from "@mju-psi/yti-common-ui";

@NgModule({
  declarations: [
    ClassVisualizationComponent,
    VisualizationContextMenuComponent,
    VisualizationPopoverComponent
  ],
  imports: [
    CommonModule,
    IowServicesModule,
    TranslateModule,
    NgbModule,
    YtiCommonModule
  ],
  providers: [
  ],
  exports: [
    ClassVisualizationComponent,
    VisualizationContextMenuComponent,
    VisualizationPopoverComponent
  ]
})
export class IowComponentsVisualizationFormModule { }
