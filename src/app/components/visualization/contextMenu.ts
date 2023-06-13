// import { labelNameToResourceIdIdentifier, Optional, requireDefined } from '@mju-psi/yti-common-ui';
// import { IScope } from 'angular';
// import { ModelPageActions } from 'app/components/model/modelPage';
// import { Model } from 'app/entities/model';
// import { VisualizationClass } from 'app/entities/visualization';
// import { ClassService } from 'app/services/classService';
// import { Coordinate } from 'app/types/visualization';
// import { LegacyComponent } from 'app/utils/angular';

// export interface ContextMenuTarget {
//   coordinate: Coordinate;
//   target: VisualizationClass;
// }

// interface Action {
//   name: string;
//   invoke: () => void;
// }

// @LegacyComponent({
//   bindings: {
//     model: '=',
//     modelPageActions: '=',
//     target: '='
//   },
//   template: `
//       <div class="dropdown-menu show" role="menu" ng-style="$ctrl.style" ng-if="$ctrl.actions.length > 0">
//         <div class="dropdown-item" role="menuitem" ng-repeat="action in $ctrl.actions">
//           <a id="{{$ctrl.getIdNameFromActionName(action.name) + '_context_dropdown_action'}}" ng-click="$ctrl.invokeAction(action)">{{action.name | translate}}</a>
//         </div>
//       </div>
//   `
// })
// export class VisualizationContextMenuComponent {

//   model: Model;
//   modelPageActions: ModelPageActions;
//   target: Optional<ContextMenuTarget>;
//   actions: Action[] = [];
//   style: any;

//   constructor(private $scope: IScope,
//               private classService: ClassService) {
//     'ngInject';
//   }

//   $onInit() {

//     this.$scope.$watch(() => this.target, target => {
//       if (target) {

//         this.style = {
//           left: target.coordinate.x,
//           top: target.coordinate.y
//         };

//         this.actions = [];

//         if (!target.target.resolved) {
//           if (this.model.isOfType('library')) {
//             this.actions.push({ name: 'Assign class to library', invoke: () => this.assignClassToModel() });
//           } else {
//             this.actions.push({ name: 'Specialize class to profile', invoke: () => this.specializeClass() });
//           }
//         }
//       }
//     });
//   }

//   assignClassToModel() {
//     this.classService.getClass(this.target!.target.id, this.model)
//       .then(klass => this.modelPageActions.assignClassToModel(klass));
//   }

//   specializeClass() {
//     this.classService.getInternalOrExternalClass(this.target!.target.id, this.model)
//       .then(klassOrNull => {
//         const klass = requireDefined(klassOrNull); // TODO: check if class can actually be null
//         this.modelPageActions.createShape(klass, klass.external)
//       });
//   }

//   dismiss() {
//     this.target = null;
//     this.actions = [];
//   }

//   invokeAction(action: Action) {
//     action.invoke();
//     this.dismiss();
//   }

//   getIdNameFromActionName(actionName: string) {
//     return labelNameToResourceIdIdentifier(actionName);
//   }
// }



import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { labelNameToResourceIdIdentifier, Optional, requireDefined } from '@mju-psi/yti-common-ui';
import { ModelPageActions } from 'app/components/model/modelPage';
import { Model } from 'app/entities/model';
import { VisualizationClass } from 'app/entities/visualization';
import { DefaultClassService } from 'app/services/classService';
import { Coordinate } from 'app/types/visualization';

export interface ContextMenuTarget {
  coordinate: Coordinate;
  target: VisualizationClass;
}

interface Action {
  name: string;
  invoke: () => void;
}

@Component({
  selector: 'visualization-context-menu',
  template: `
    <div class="dropdown-menu show" role="menu" [ngStyle]="style" *ngIf="actions.length > 0">
      <div class="dropdown-item" role="menuitem" *ngFor="let action of actions">
        <a [id]="getIdNameFromActionName(action.name) + '_context_dropdown_action'" (click)="invokeAction(action)">{{ action.name | translate }}</a>
      </div>
    </div>
  `
})
export class VisualizationContextMenuComponent implements OnInit, OnChanges {
  @Input() model: Model;
  @Input() modelPageActions: ModelPageActions;
  @Input() target: Optional<ContextMenuTarget>;

  actions: Action[] = [];
  style: any;

  constructor(private classService: DefaultClassService) {}

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.target && changes.target.currentValue) {
      const target = changes.target.currentValue;
      this.style = {
        left: target.coordinate.x + 'px',
        top: target.coordinate.y + 'px'
      };

      this.actions = [];

      if (!target.target.resolved) {
        if (this.model.isOfType('library')) {
          this.actions.push({ name: 'Assign class to library', invoke: () => this.assignClassToModel() });
        } else {
          this.actions.push({ name: 'Specialize class to profile', invoke: () => this.specializeClass() });
        }
      }
    }
  }

  assignClassToModel() {
    this.classService.getClass(this.target!.target.id, this.model).then((klass) => {
      this.modelPageActions.assignClassToModel(klass);
    });
  }

  specializeClass() {
    this.classService.getInternalOrExternalClass(this.target!.target.id, this.model).then((klassOrNull) => {
      const klass = requireDefined(klassOrNull); // TODO: check if class can actually be null
      this.modelPageActions.createShape(klass, klass.external);
    });
  }

  dismiss() {
    this.target = null;
    this.actions = [];
  }

  invokeAction(action: Action) {
    action.invoke();
    this.dismiss();
  }

  getIdNameFromActionName(actionName: string) {
    return labelNameToResourceIdIdentifier(actionName);
  }
}

