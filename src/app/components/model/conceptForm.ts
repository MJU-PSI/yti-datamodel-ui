// import { Localizer } from 'app/services/languageService';
// import { Concept } from 'app/entities/vocabulary';
// import { Model } from 'app/entities/model';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     concept: '=',
//     model: '='
//   },
//   template: require('./conceptForm.html')
// })
// export class ConceptFormComponent {

//   concept: Concept;
//   model: Model;
//   localizer: Localizer;
// }

import { Component, Input  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Model } from 'app/entities/model';
import { Concept } from 'app/entities/vocabulary';
import { Localizer } from 'app/services/languageService';


@Component({
  selector: 'concept-form',
  template: ''
})
export class ConceptFormComponent  {
  @Input() concept: Concept;
  @Input() model: Model;
  @Input() form: NgForm;
  localizer: Localizer;

}
