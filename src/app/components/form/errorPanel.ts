// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     error: '='
//   },
//   template: require('./errorPanel.html')
// })
// export class ErrorPanelComponent {
// }

import { Component, Input  } from '@angular/core';


@Component({
  selector: 'error-panel',
  templateUrl: './errorPanel.html'
})
export class ErrorPanelComponent  {
  @Input() error: string;

}
