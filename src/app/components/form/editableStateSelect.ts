// import { EditableForm } from './editableEntityController';
// import { Model } from 'app/entities/model';
// import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
// import { Status } from '@mju-psi/yti-common-ui';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     state: '=',
//     model: '=',
//     id: '@'
//   },
//   template: `
//       <div class="form-group">

//         <label translate>Status</label>

//         <iow-select ng-if="$ctrl.isEditing()" id="{{$ctrl.id}}" id-prefix="$ctrl.id" options="state in $ctrl.getStates()" ng-model="$ctrl.state">
//           <span>{{state | translate}}</span>
//         </iow-select>

//         <p ng-if="!$ctrl.isEditing()" class="form-control-static">{{$ctrl.state | translate}}</p>
//       </div>
//     `,
//   require: {
//     form: '?^form'
//   }
// })
// export class EditableStateSelectComponent {

//   model: Model;
//   state: Status;
//   id: string;

//   form: EditableForm;

//   constructor(private authorizationManagerService: AuthorizationManagerService) {
//     'ngInject';
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   getStates() {
//     return this.authorizationManagerService.getAllowedStatuses(this.state);
//   }
// }


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Model } from 'app/entities/model';
import { AuthorizationManagerService } from 'app/services/authorizationManagerService';
import { Status } from '@mju-psi/yti-common-ui';
import { NgForm } from '@angular/forms';
import { EditableService } from 'app/services/editable.service';

@Component({
  selector: 'editable-state-select',
  template: `
    <div class="form-group">
      <label translate >Status</label>
      <iow-select *ngIf="isEditing()" [id]="id" [(ngModel)]="state" [options]="getStates()" (ngModelChange)="onModelChange($event)">
      </iow-select>
      <p *ngIf="!isEditing()" class="form-control-static">{{ state | translate }}</p >
    </div>`
})
export class EditableStateSelectComponent {
  @Input() model: Model;
  @Input() state: Status;
  @Input() id: string;
  @Input() form: NgForm;
  @Output() stateChange: EventEmitter<Status> = new EventEmitter<Status>();

  constructor(
    private authorizationManagerService: AuthorizationManagerService,
    private editableService: EditableService
    ) { }

  isEditing() {
    return this.editableService.editing;
  }

  getStates() {
    return this.authorizationManagerService.getAllowedStatuses(this.state);
  }

  onModelChange(event: Status) {
    this.stateChange.emit(event);
  }
}
