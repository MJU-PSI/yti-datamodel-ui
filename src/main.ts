import * as jQuery from 'jquery';
import 'angular';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { YtiCommonUiConfig, YTI_COMMON_UI_CONFIG } from '@mju-psi/yti-common-ui';
import { Configuration } from './configuration/configuration';

require('imports-loader?define=>false!jquery-mousewheel/jquery.mousewheel')(jQuery);

// export const done = platformBrowserDynamic().bootstrapModule(AppModule);

// Platform creation and bootstrapping of the application is delayed until we have loaded the configuration file.
// The contents of the configuration file will be replaced (in Dockerfile) based on environment
let configurationPath = `/configuration/configuration.json`;
export const done = fetch(configurationPath)
  .then(response => response.json())
  .then((configuration: Configuration) => {
    if (configuration.production) {
      enableProdMode();
    }

    const COMMON_UI_CONFIG: YtiCommonUiConfig = {
      url: configuration.url,
      realm: configuration.realm,
      clientId: configuration.clientId
    };

    return platformBrowserDynamic([
      { provide: YTI_COMMON_UI_CONFIG, useValue: COMMON_UI_CONFIG },
    ]).bootstrapModule(AppModule);
  })
  .catch(error => console.error(error));
