import { IScope } from 'angular';
import { Location, LocationService } from 'app/services/locationService';
import { labelNameToResourceIdIdentifier } from '@mju-psi/yti-common-ui';
import { LanguageService } from 'app/services/languageService';
import { TranslateService } from '@ngx-translate/core';
import { LegacyComponent } from 'app/utils/angular';
import { Configuration } from 'app/configuration.interface';

declare let __config: Configuration;
@LegacyComponent({
  template: require('./breadcrumb.html')
})
export class BreadcrumbComponent {

  location: Location[];

  baseHref: string;

  constructor($scope: IScope,
              locationService: LocationService,
              private languageService: LanguageService,
              private translateService: TranslateService) {
    'ngInject';
    this.baseHref =__config.baseHref;
    $scope.$watch(() => locationService.location, location => {
      this.location = location;
    });
  }

  getIdNameFromLocation(location: Location) {
    return location.label ? labelNameToResourceIdIdentifier(this.languageService.translate(location.label))
                          : location.localizationKey ? this.translateService.instant(location.localizationKey)
                                                     : '';
  }
}
