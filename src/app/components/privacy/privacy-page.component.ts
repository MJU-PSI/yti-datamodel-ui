import { Component } from '@angular/core';
import { LocationService } from 'app/services/locationService';
import { LegacyComponent } from 'app/utils/angular';

@LegacyComponent({
  template: require('./privacy-page.component.html')
})
export class PrivacyPageComponent {

  constructor(private locationService: LocationService) {
    'ngInject';
    locationService.atPrivacyPage();
  }
}
