// import { Model } from 'app/entities/model';
// import { LegacyComponent } from 'app/utils/angular';
// import { EditableForm } from 'app/components/form/editableEntityController';

// @LegacyComponent({
//   bindings: {
//     id: '=',
//     model: '=',
//     namespacesInUse: '<',
//     statusChanged: '=',
//     changeResourceStatusesToo: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: require('./modelForm.html')
// })
// export class ModelFormComponent {

//   model: Model;
//   namespacesInUse?: Set<string>;
//   form: EditableForm;
//   statusChanged: boolean;
//   changeResourceStatusesToo: boolean;

//   get allowProfiles() {
//     return this.model.isOfType('profile');
//   }

//   get previousModelLink() {
//     return this.model.previousModel ? this.model.previousModel.uri : null;
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   showChangeResourceStatusesCheckbox(): boolean {
//     return this.form.editing && this.statusChanged;
//   }
// }

import { Component, Input } from '@angular/core';
import { Model } from 'app/entities/model';
import { NgForm } from '@angular/forms';
import { EditableService } from 'app/services/editable.service';

@Component({
  selector: 'model-form',
  templateUrl: 'modelForm.html'
})
export class ModelFormComponent {
  @Input() id: string;
  @Input() model: Model;
  @Input() namespacesInUse?: Set<string>;
  @Input() statusChanged: boolean;
  @Input() changeResourceStatusesToo: boolean;

  constructor(private editableService: EditableService) {}

  get allowProfiles(): boolean {
    return this.model.isOfType('profile');
  }

  get previousModelLink(): string | null {
    return this.model.previousModel ? this.model.previousModel.uri : null;
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  showChangeResourceStatusesCheckbox(): boolean {
    return this.editableService.editing && this.statusChanged;
  }
}
