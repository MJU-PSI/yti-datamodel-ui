// import { Destination } from 'app/types/entity';
// import { Model } from 'app/entities/model';
// import { normalizeModelType } from 'app/utils/entity';
// import { LegacyComponent } from 'app/utils/angular';


// @LegacyComponent({
//   bindings: {
//     entity: '=',
//     model: '='
//   },
//   template: require('./definedBy.html')
// })
// export class DefinedByComponent {

//   entity: Destination;
//   model: Model;

//   get definedByTitle() {
//     const type = normalizeModelType(this.entity && this.entity.definedBy && this.entity.definedBy.type || []);
//     return 'Defined by' + (type ? ' ' + type : '');
//   }

//   linkTo() {
//     return this.entity && this.model.linkToResource(this.entity.id);
//   }
// }

import { Component, Input } from '@angular/core';
import { Destination } from 'app/types/entity';
import { Model } from 'app/entities/model';
import { normalizeModelType } from 'app/utils/entity';

@Component({
  selector: 'defined-by',
  templateUrl: './defined-by.html'
})
export class DefinedByComponent {
  @Input() entity: Destination;
  @Input() model: Model;

  get definedByTitle(): string {
    const type = normalizeModelType(this.entity?.definedBy?.type || []);
    return 'Defined by' + (type ? ' ' + type : '');
  }

  linkTo() {
    return this.entity && this.model.linkToResource(this.entity.id);
  }
}
