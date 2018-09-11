import { ILocationService } from 'angular';
import { gettextCatalog as GettextCatalog } from 'angular-gettext';
import { LanguageService } from 'app/services/languageService';
import { Uri } from 'app/entities/uri';
import { isString, isNumber, isBoolean } from 'yti-common-ui/utils/object';
import { isDifferentUrl } from 'app/utils/angular';
import { Moment } from 'moment';
import * as moment from 'moment';
import { LanguageContext } from 'app/types/language';
import { isLocalizable } from 'app/utils/language';
import { Localizable } from 'yti-common-ui/types/localization';

export type Value = string|Localizable|number|Uri|Moment;

function isMoment(obj: any): obj is Moment {
  return moment.isMoment(obj);
}

export class DisplayItem {

  onClick?: (value: Value) => void;

  constructor(private $location: ILocationService,
              private languageService: LanguageService,
              private gettextCatalog: GettextCatalog,
              private config: DisplayItemConfiguration) {

    this.onClick = config.onClick;
  }

  get displayValue(): string {
    const value = this.value;

    if (isMoment(value)) {
      return value.format(this.gettextCatalog.getString('date format'));
    } else if (value instanceof Uri) {
      return value.compact;
    }  else if (isLocalizable(value)) {
      return this.languageService.translate(value, this.config.context());
    } else if (isString(value)) {
      if (this.config.valueAsLocalizationKey) {
        return this.gettextCatalog.getString(value);
      } else {
        return value;
      }
    } else if (isNumber(value)) {
      return value.toString();
    } else if (isBoolean(value)) {
      return this.gettextCatalog.getString(value ? 'Yes' : 'No');
    } else if (!value) {
      return '';
    } else {
      throw new Error('Cannot convert to display value: ' + value);
    }
  }

  get value() {
    return this.config.value();
  }

  get href() {
    if (this.config.hideLinks && this.config.hideLinks()) {
      return null;
    } else {
      const link = this.config.link && this.config.link();

      if (!link || !isDifferentUrl(link, this.$location.url())) {
        return null;
      } else {
        return link;
      }
    }
  }
}

export interface DisplayItemConfiguration {
  hideLinks?: () => boolean;
  valueAsLocalizationKey?: boolean;
  context(): LanguageContext;
  value(): Value;
  link?(): string;
  onClick?(value: Value): void;
}


export class DisplayItemFactory {
  /* @ngInject */
  constructor(private $location: ILocationService, private languageService: LanguageService, private gettextCatalog: GettextCatalog) {
  }

  create(config: DisplayItemConfiguration) {
    return new DisplayItem(this.$location, this.languageService, this.gettextCatalog, config);
  }
}
