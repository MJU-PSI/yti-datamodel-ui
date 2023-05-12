// import * as angular from 'angular';


// export const module3 = angular.module('iow.components.visualization', ['iow.services']);

import { NgModule } from "@angular/core";
import { IowServicesModule } from "app/services/module";
import { ClassVisualizationComponent } from "./classVisualization";
import { VisualizationContextMenuComponent } from "./contextMenu";
import { VisualizationPopoverComponent } from "./popover";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    ClassVisualizationComponent,
    VisualizationContextMenuComponent,
    VisualizationPopoverComponent
  ],
  imports: [
    IowServicesModule,
    NgbModule
  ],
  providers: [
  ],
  exports: [
  ]
})
export class IowComponentsVisualizationFormModule { }
