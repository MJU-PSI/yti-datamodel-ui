// import * as jQuery from 'jquery';
// import 'angular';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { YtiCommonUiConfig, YTI_COMMON_UI_CONFIG } from '@mju-psi/yti-common-ui';
import { Configuration } from './app/configuration.interface';

import './app/extensions/form.extensions';

require('imports-loader?define=>false!jquery-mousewheel/jquery.mousewheel')(jQuery);

// import './init.ts'

// export const done = platformBrowserDynamic().bootstrapModule(AppModule);

// Platform creation and bootstrapping of the application is delayed until we have loaded the configuration file.
// The contents of the configuration file will be replaced (in Dockerfile) based on environment
declare let __config: Configuration;

if (__config.production) {
  enableProdMode();
}


const COMMON_UI_CONFIG: YtiCommonUiConfig = {
  keycloakUrl: __config.keycloakUrl,
  keycloakRealm: __config.keycloakRealm,
  keycloakClientId: __config.keycloakClientId
};

export const done = platformBrowserDynamic([
  { provide: YTI_COMMON_UI_CONFIG, useValue: COMMON_UI_CONFIG }
]).bootstrapModule(AppModule);
