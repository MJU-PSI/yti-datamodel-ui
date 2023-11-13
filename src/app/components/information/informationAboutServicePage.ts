import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocationService } from 'app/services/locationService';
import { LegacyComponent } from 'app/utils/angular';
import { Subscription } from 'rxjs';

@LegacyComponent({
  template: require('./informationAboutServicePage.html')
})
export class InformationAboutServicePageComponent {
  currentLang: String;
  langChangeSubscription: Subscription;

  constructor(locationService: LocationService, translateService: TranslateService) {
    'ngInject';
    locationService.atInformationAboutService();

    this.currentLang = translateService.currentLang;

    this.langChangeSubscription = translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    })
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }
}
