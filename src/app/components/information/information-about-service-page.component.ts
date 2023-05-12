// import { LocationService } from 'app/services/locationService';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   template: require('./informationAboutServicePage.html')
// })
// export class InformationAboutServicePageComponent {

//   constructor(locationService: LocationService) {
//     'ngInject';
//     locationService.atInformationAboutService();
//   }
// }


import { Component } from '@angular/core';
import { LocationService } from 'app/services/locationService';

@Component({
  selector: 'app-information-about-service-page',
  templateUrl: './information-about-service-page.component.html'
})
export class InformationAboutServicePageComponent {

  constructor(locationService: LocationService) {
    locationService.atInformationAboutService();
  }
}
