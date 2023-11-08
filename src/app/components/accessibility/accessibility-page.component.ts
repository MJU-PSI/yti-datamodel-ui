import { Component } from '@angular/core';
import { LocationService } from 'app/services/locationService';
import { LegacyComponent } from 'app/utils/angular';

@LegacyComponent({
  template: require('./accessibility-page.component.html')
})
export class AccessibilityPageComponent {

  constructor(private locationService: LocationService) {
    'ngInject';
    locationService.atAccessibilityPage();
  }
}
