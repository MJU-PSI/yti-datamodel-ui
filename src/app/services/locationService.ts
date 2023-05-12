// import { Model } from 'app/entities/model';
// import { Localizable } from '@mju-psi/yti-common-ui';
// import { KnownModelType } from 'app/types/entity';
// import { ConfigService } from './configService';
// import { TranslateService } from '@ngx-translate/core';
// import { Subscription } from 'rxjs';
// import { Title } from '@angular/platform-browser';

// export interface Location {
//   localizationKey?: string;
//   label?: Localizable;

//   iowUrl?(): string;
// }

// const frontPage = { localizationKey: 'Front page', iowUrl: () => ' ' };

// export class LocationService {

//   location: Location[] = [frontPage];

//   private titleTranslationSubscription: Subscription;

//   constructor(private configService: ConfigService, private translateService: TranslateService, private titleService: Title) {
//     'ngInject';

//     configService.getConfig().then(config => {
//       this.titleTranslationSubscription = translateService.stream('Data Vocabularies').subscribe(value => {
//         titleService.setTitle(config.getEnvironmentIdentifier('prefix') + value);
//       });
//     }).catch((reason) => {console.error('Could not fetch configuration: "' + reason + '"')});
//   }

//   $onDestroy() {
//     this.titleTranslationSubscription.unsubscribe();
//   }

//   atNewModel(type: KnownModelType) {
//     this.changeLocation([{ localizationKey: `Add new ${type}` }])
//   }

//   atModel(model: Model, selection: Location | null): void {
//     this.changeLocation(selection ? [model, selection] : [model]);
//   }

//   atUser(): void {
//     this.changeLocation([{
//       localizationKey: 'User details',
//       iowUrl() {
//         return '/#user';
//       }
//     }]);
//   }

//   atInformationAboutService() {
//     this.changeLocation([{
//       localizationKey: 'Information about the service'
//     }]);
//   }

//   atFrontPage(): void {
//     this.changeLocation([]);
//   }

//   private changeLocation(location: Location[]): void {
//     location.unshift(frontPage);
//     this.location = location;
//   }
// }


import { Model } from 'app/entities/model';
import { Localizable } from '@mju-psi/yti-common-ui';
import { KnownModelType } from 'app/types/entity';
import { ConfigService } from './configService';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { OnDestroy, Injectable } from '@angular/core';

export interface Location {
  localizationKey?: string;
  label?: Localizable;

  iowUrl?(): string;
}

const frontPage: Location = { localizationKey: 'Front page', iowUrl: () => ' ' };

@Injectable()
export class LocationService implements OnDestroy {

  location: Location[] = [frontPage];
  location$:  BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([frontPage]);

  private titleTranslationSubscription: Subscription;

  constructor(private configService: ConfigService, private translateService: TranslateService, private titleService: Title) {
    configService.getConfig().then(config => {
      this.titleTranslationSubscription = translateService.stream('Data Vocabularies').subscribe(value => {
        titleService.setTitle(config.getEnvironmentIdentifier('prefix') + value);
      });
    }).catch((reason) => {console.error(`Could not fetch configuration: "${reason}"`)});
  }

  ngOnDestroy(): void {
    this.titleTranslationSubscription.unsubscribe();
  }

  atNewModel(type: KnownModelType): void {
    this.changeLocation([{ localizationKey: `Add new ${type}` }])
  }

  atModel(model: Model, selection: Location | null): void {
    this.changeLocation(selection ? [model, selection] : [model]);
  }

  atUser(): void {
    this.changeLocation([{
      localizationKey: 'User details',
      iowUrl() {
        return '/#user';
      }
    }]);
  }

  atInformationAboutService(): void {
    this.changeLocation([{
      localizationKey: 'Information about the service'
    }]);
  }

  atFrontPage(): void {
    this.changeLocation([]);
  }

  private changeLocation(location: Location[]): void {
    location.unshift(frontPage);
    this.location = location;
    this.location$.next(location);
  }
}
